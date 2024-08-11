import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Dropdown, Option} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { availableCurrencies } from "./availableCurrencies";

export const CurrencyConversionSettings = () => {
    const { t } = useTranslation("extension[CurrencyConversion]");
    const extensionId = "CurrencyConversion";
    const { value: currencies, updateValue: setCurrencies } = useExtensionSetting<string[]>({
        extensionId,
        key: "currencies",
    });

    const { value: defaultCurrency, updateValue: setDefaultCurrency } = useExtensionSetting<string[]>({
        extensionId,
        key: "defaultCurrency",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
        
                <Setting
                    label={t("currencies")}
                    control={
                        <Dropdown
                            selectedOptions={currencies}
                            value={currencies.map((c) => c.toUpperCase()).join(", ")}
                            placeholder={t("selectCurrencies")}
                            multiselect
                            onOptionSelect={(_, { selectedOptions }) => setCurrencies(selectedOptions)}
                        >
                            {Object.keys(availableCurrencies).map((availableCurrency) => (
                                <Option key={availableCurrency} value={availableCurrency}>
                                    {`${availableCurrency.toUpperCase()} (${availableCurrencies[availableCurrency]})`}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label={t("Default Currency")}
                    control={
                        <Dropdown
                            selectedOptions={defaultCurrency}
                            value={defaultCurrency.map((c) => c.toUpperCase()).join(", ")}
                            placeholder={t("selectCurrencies")}
                            onOptionSelect={(_, { selectedOptions }) => setDefaultCurrency(selectedOptions)}
                        >
                            {Object.keys(availableCurrencies).map((availableCurrency) => (
                                <Option key={availableCurrency} value={availableCurrency}>
                                    {`${availableCurrency.toUpperCase()} (${availableCurrencies[availableCurrency]})`}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
