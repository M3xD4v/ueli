import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Net } from "electron";

export class CurrencyConversion implements Extension {
    private static readonly translationNamespace = "extension[CurrencyConversion]";

    public readonly id = "CurrencyConversion";
    public readonly name = "Currency Conversion";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: CurrencyConversion.translationNamespace,
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings = {
        currencies: ["usd", "chf", "eur"],
        defaultCurrency: ["usd"]
    };

    private readonly rates: Record<string, Record<string, number>>;

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly net: Net,
        private readonly assetPathResolver: AssetPathResolver,
    ) {
        this.rates = {};
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        const parts = searchTerm.trim().replace(/(\d)([a-z])/g, '$1 $2').split(" ");

        const validators = [
            () => parts.length === 2 || parts.length === 4,
            () => !isNaN(Number(parts[0])),
            () => this.currencyExists(parts[1].toLowerCase())
        ];

        if (parts.length === 4) {
            validators.push(() => ["in", "to"].includes(parts[2].toLowerCase()));
        }
        
        for (const validator of validators) {
            if (!validator()) {
                return [];
            }
        }
        const defaultCurrency = this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "defaultCurrency"),
            this.defaultSettings.defaultCurrency,
        )[0];
        
        let conversionResult;
        if (parts.length === 2) {
            const base = parts[1].toLowerCase();
            const target = defaultCurrency;
            conversionResult = this.convert({ value: Number(parts[0]), base, target });
        } else {
            const base = parts[1].toLowerCase();
            const target = parts[3].toLowerCase();
            conversionResult = this.convert({ value: Number(parts[0]), base, target });
        }
        
        return [
            {
                defaultAction: SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: conversionResult.toFixed(2),
                    description: "Currency Conversion",
                    descriptionTranslation: {
                        key: "copyToClipboard",
                        namespace: CurrencyConversion.translationNamespace,
                    },
                }),
                description: "Currency Conversion",
                descriptionTranslation: {
                    key: "currencyConversion",
                    namespace: CurrencyConversion.translationNamespace,
                },
                id: `currency-conversion:instant-result`,
                image: this.getImage(),
                name: `${conversionResult.toFixed(2)} ${parts.length === 2 ? defaultCurrency : parts[3].toUpperCase()}`,
            },
        ];
    }
 

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        await this.setRates();
        return [];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "currency-conversion.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Currency Conversion",
                currencies: "Currencies",
                selectCurrencies: "Select currencies",
                copyToClipboard: "Copy to clipboard",
                currencyConversion: "Currency Conversion",
            },
            "de-CH": {
                extensionName: "Währungsumrechnung",
                currencies: "Währungen",
                defaultCurrency: "Standardwährung",
                selectCurrencies: "Währungen wählen",
                copyToClipboard: "In Zwischenablage kopieren",
                currencyConversion: "Währungsumrechnung",
            },
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "currencies")];
    }

    private convert({ value, base, target }: { value: number; base: string; target: string }): number {
        return value * this.rates[base.toLowerCase()][target.toLowerCase()];
    }

    private currencyExists(currency: string): boolean {
        return Object.keys(this.rates).includes(currency.toLowerCase());
    }

    private async setRates(): Promise<void> {
        const currencies = this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "currencies"),
            this.defaultSettings.currencies,
        );

        await Promise.allSettled(currencies.map((currency) => this.setRate(currency)));
    }

    private async setRate(currency: string): Promise<void> {
        const response = await this.net.fetch(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`,
        );

        const responseJson = await response.json();

        this.rates[currency] = responseJson[currency];
    }
}
