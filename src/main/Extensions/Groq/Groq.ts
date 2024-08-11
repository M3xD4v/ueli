import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import { type SearchResultItem, SearchResultItemActionUtility } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { InvocationArgument } from "@common/Extensions/Groq";
import { GroqConverter } from "./GroqConverter";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Settings } from "./Settings";
import { getExtensionSettingKey } from "@common/Core/Extension";

export class Groq implements Extension {
    public readonly id = "Groq";
    public readonly name = "Groq";
    public global_prompt = "";

    public readonly author = {
        name: "Archient",
        githubUserName: "Archient",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
        private readonly settingsManager: SettingsManager
    ) {}

    private readonly defaultSettings: Settings = {
        apiKey: "",
        defaultLLM: "Auto",
    };

  public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        const parts = searchTerm.trim().replace(/(\d)([a-z])/g, '$1 $2').split(" ");
        if (parts[0] !== ".g") {return []};
        const prompt = parts.slice(1).join(' ')
        this.global_prompt = prompt
        const { t } = this.translator.createT(this.getI18nResources());
        return [
            {
                defaultAction: SearchResultItemActionUtility.createInvokeExtensionAction({
                    extensionId: this.id,
                    description: t("searchResultItemActionDescription"),
                    fluentIcon: "OpenRegular",
                }),
                description: "Prompt Groq",
                descriptionTranslation: {
                    key: "Prompt Groq",
                    namespace: "buh",
                },
                id: `groq:instant-result`,
                image: this.getImage(),
                name: prompt,
            },
        ];
    }
 
    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        return [
            {
                id: "Groq:invoke",
                description: t("searchResultItemDescription"),
                name: t("searchResultItemName"),
                image: this.getImage(),
                defaultAction: SearchResultItemActionUtility.createInvokeExtensionAction({
                    extensionId: this.id,
                    description: t("searchResultItemActionDescription"),
                    fluentIcon: "OpenRegular",
                }),
            },
        ];
    }

    public async invoke({ action, payload }: InvocationArgument): Promise<string> {
        const Model = this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "defaultLLM"),
            this.defaultSettings.defaultLLM,
        );
        return action === "encode" ? GroqConverter.encode(payload, this.getApiKey(), Model) : GroqConverter.decode(payload, this.getApiKey());
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue() {
        return undefined;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "Groq.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Groq",
                searchResultItemDescription: "Groq",
                searchResultItemName: "Groq",
                searchResultItemActionDescription: "Open Groq Chat",
                copyToClipboard: "Copy result to clipboard",
                promptPlaceholder: "Enter your prompt",
                responsePlaceholder: "Response",
                prompt: this.getPrompt(),
            }
        };
    }


    public getPrompt(): string {
        return this.global_prompt;
      }
    private getApiKey(): string {
        const apiKey = this.settingsManager.getValue<string | undefined>(
            getExtensionSettingKey(this.id, "apiKey"),
            undefined,
            true,
        );

        if (!apiKey) {
            throw new Error("Missing Groq API key");
        }
        
        return apiKey;
    }
}
