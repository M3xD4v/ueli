import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { Groq } from "./Groq";

export class GroqModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const translator = dependencyRegistry.get("Translator");
        const settingsManager = dependencyRegistry.get("SettingsManager");

        return {
            extension: new Groq(assetPathResolver, translator, settingsManager),
        };
    }
}
