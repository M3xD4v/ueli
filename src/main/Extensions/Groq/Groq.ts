import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import { type SearchResultItem, SearchResultItemActionUtility } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { InvocationArgument } from "@common/Extensions/Groq";
import { GroqConverter } from "./GroqConverter";

export class Groq implements Extension {
    public readonly id = "Groq";
    public readonly name = "Groq";

    public readonly author = {
        name: "Christopher Steiner",
        githubUserName: "ChristopherSteiner",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
    ) {}

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
        return action === "encode" ? GroqConverter.encode(payload) : GroqConverter.decode(payload);
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue() {
        return undefined;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "base64-conversion.png")}`,
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
                encodePlaceHolder: "Enter your prompt",
                decodePlaceHolder: "Output",
            }
        };
    }
}
