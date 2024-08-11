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
    const { value: defaultLLM, updateValue: setDefaultLLM } = useExtensionSetting<string>({
        extensionId,
        key: "defaultLLM",
    });

    const sourceModelsVirtualizerMeasure = useStaticVirtualizerMeasure({
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
                    label="Model"
                    control={
                        <Dropdown
                            value={llmModels[defaultLLM]}
                            onOptionSelect={(_, { optionValue }) => optionValue && setDefaultLLM(optionValue)}
                            selectedOptions={[defaultLLM]}
                            listbox={{ ref: sourceModelsVirtualizerMeasure.scrollRef, style: { maxHeight: 145 } }}
                        >
                            <Virtualizer
                                numItems={Object.keys(llmModels).length}
                                virtualizerLength={sourceModelsVirtualizerMeasure.virtualizerLength}
                                bufferItems={sourceModelsVirtualizerMeasure.bufferItems}
                                bufferSize={sourceModelsVirtualizerMeasure.bufferSize}
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
            </SettingGroup>
        </SettingGroupList>
    );
};
