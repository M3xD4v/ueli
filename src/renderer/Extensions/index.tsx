import { useExtensionProps } from "@Core/Hooks";
import type { ReactElement } from "react";
import { ApplicationSearchSettings } from "./ApplicationSearch";
import { Base64Conversion } from "./Base64Conversion";
import { Groq, GroqSettings } from "./Groq";
import { BrowserBookmarksSettings } from "./BrowserBookmarks";
import { CalculatorSettings } from "./Calculator";
import { ColorConverterSettings } from "./ColorConverter";
import { CurrencyConversionSettings } from "./CurrencyConversion";
import { DeeplTranslator, DeeplTranslatorSettings } from "./DeeplTranslator";
import { FileSearch, FileSearchSettings } from "./FileSearch";
import { TerminalLauncherSettings } from "./TerminalLauncher";
import { WebSearchExtension } from "./WebSearch";
import { WebSearchSettings } from "./WebSearch/WebSearchSettings";
import { WorkflowSettings } from "./Workflow";

type ExtensionReactElements = {
    extension?: ReactElement;
    settings?: ReactElement;
};

export const getExtension = (extensionId: string): ExtensionReactElements | undefined => {
    const props = useExtensionProps();

    const extensions: Record<string, ExtensionReactElements> = {
        ApplicationSearch: {
            settings: <ApplicationSearchSettings />,
        },
        Base64Conversion: {
            extension: <Base64Conversion {...props} />,
        },
        Groq: {
            extension: <Groq {...props} />,
            settings: <GroqSettings />,
        },
        BrowserBookmarks: {
            settings: <BrowserBookmarksSettings />,
        },
        Calculator: {
            settings: <CalculatorSettings />,
        },
        ColorConverter: {
            settings: <ColorConverterSettings />,
        },
        CurrencyConversion: {
            settings: <CurrencyConversionSettings />,
        },
        DeeplTranslator: {
            extension: <DeeplTranslator {...props} />,
            settings: <DeeplTranslatorSettings />,
        },
        FileSearch: {
            extension: <FileSearch {...props} />,
            settings: <FileSearchSettings />,
        },
        TerminalLauncher: {
            settings: <TerminalLauncherSettings />,
        },
        WebSearch: {
            extension: <WebSearchExtension {...props} />,
            settings: <WebSearchSettings />,
        },
        Workflow: {
            settings: <WorkflowSettings />,
        },
    };

    return extensions[extensionId];
};
