import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Dropdown, Input, Option } from "@fluentui/react-components";
import { Virtualizer, useStaticVirtualizerMeasure } from "@fluentui/react-components/unstable";
import { useTranslation } from "react-i18next";
import { llmModels } from "./llmModels";
import { targetLanguages } from "./targetLanguages";

export const GroqSettings = () => {
    const extensionId = "Groq";
    const { t } = useTranslation("extension[Groq]");

    const { value: apiKey, updateValue: setApiKey } = useExtensionSetting<string>({
        extensionId,
        key: "apiKey",
        isSensitive: true,
    });
    const { value: defaultLLM, updateValue: setdefaultLLM } = useExtensionSetting<string>({
        extensionId,
        key: "test",
        isSensitive: true,
    });


    const { value: sourceLanguage, updateValue: setSourceLanguage } = useExtensionSetting<string>({
        extensionId,
        key: "defaultSourceLanguage",
    });

    const { value: targetLanguage, updateValue: setTargetLanguage } = useExtensionSetting<string>({
        extensionId,
        key: "defaultTargetLanguage",
    });

    const sourceLanguageVirtualizerMeasure = useStaticVirtualizerMeasure({
        defaultItemSize: 20,
        direction: "vertical",
    });

    const targetLanguageVirtzalizerMeasure = useStaticVirtualizerMeasure({
        defaultItemSize: 20,
        direction: "vertical",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label="API Key"
                    control={
                        <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
                            <Input value={apiKey} onChange={(_, { value }) => setApiKey(value)} />
                        </div>
                    }
                />
                <Setting
                    label="Default source language"
                    control={
                        <Dropdown
                            value={llmModels[sourceLanguage]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setSourceLanguage(optionValue)}
                            selectedOptions={[sourceLanguage]}
                            listbox={{ ref: sourceLanguageVirtualizerMeasure.scrollRef, style: { maxHeight: 145 } }}
                        >
                            <Virtualizer
                                numItems={Object.keys(llmModels).length}
                                virtualizerLength={sourceLanguageVirtualizerMeasure.virtualizerLength}
                                bufferItems={sourceLanguageVirtualizerMeasure.bufferItems}
                                bufferSize={sourceLanguageVirtualizerMeasure.bufferSize}
                                itemSize={20}
                            >
                                {(i) => (
                                    <Option
                                        key={Object.keys(llmModels)[i]}
                                        value={Object.keys(llmModels)[i]}
                                        text={Object.values(llmModels)[i]}
                                    >
                                        {Object.values(llmModels)[i]}
                                    </Option>
                                )}
                            </Virtualizer>
                        </Dropdown>
                    }
                />
                <Setting
                    label="Default target language"
                    control={
                        <Dropdown
                            value={targetLanguages[targetLanguage]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setTargetLanguage(optionValue)}
                            selectedOptions={[targetLanguage]}
                            listbox={{ ref: targetLanguageVirtzalizerMeasure.scrollRef, style: { maxHeight: 145 } }}
                        >
                            <Virtualizer
                                numItems={Object.keys(targetLanguages).length}
                                virtualizerLength={targetLanguageVirtzalizerMeasure.virtualizerLength}
                                bufferItems={targetLanguageVirtzalizerMeasure.bufferItems}
                                bufferSize={targetLanguageVirtzalizerMeasure.bufferSize}
                                itemSize={20}
                            >
                                {(i) => (
                                    <Option
                                        key={Object.keys(targetLanguages)[i]}
                                        value={Object.keys(targetLanguages)[i]}
                                        text={Object.values(targetLanguages)[i]}
                                    >
                                        {Object.values(targetLanguages)[i]}
                                    </Option>
                                )}
                            </Virtualizer>
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
