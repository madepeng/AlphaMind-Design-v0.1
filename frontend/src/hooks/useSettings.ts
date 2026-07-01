import { useEffect, useRef, useState } from "react";

import { getSettings, saveSettings } from "../api/settingsApi";
import type { SettingsDTO } from "../types/settings";

type LoadStatus = "loading" | "loaded" | "error";
type SaveStatus = "editing" | "saving" | "success" | "error";

const INITIAL_SETTINGS: SettingsDTO = {
  openaiApiKey: "",
  model: "gpt-5.5",
  theme: "dark",
};

export function useSettings() {
  const [form, setForm] = useState<SettingsDTO>(INITIAL_SETTINGS);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("editing");
  const [requestId, setRequestId] = useState(0);
  const isSavingRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    getSettings()
      .then((settings) => {
        if (isActive) {
          setForm(settings);
          setLoadStatus("loaded");
          setSaveStatus("editing");
        }
      })
      .catch(() => {
        if (isActive) {
          setLoadStatus("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, [requestId]);

  const update = <Key extends keyof SettingsDTO>(
    key: Key,
    value: SettingsDTO[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaveStatus("editing");
  };

  const save = async () => {
    if (isSavingRef.current) {
      return;
    }
    isSavingRef.current = true;
    setSaveStatus("saving");
    try {
      await saveSettings(form);
      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
    } finally {
      isSavingRef.current = false;
    }
  };

  const retry = () => {
    setLoadStatus("loading");
    setRequestId((current) => current + 1);
  };

  return {
    form,
    loadStatus,
    retry,
    save,
    saveStatus,
    update,
  };
}
