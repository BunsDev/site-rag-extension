import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface SettingsFormProps {
  onClose: () => void;
}

interface Settings {
  fireCrawlApiKey: string;
  anthropicApiKey: string;
  anthropicModel: string;
  openaiApiKey: string;
  openaiEmbeddingsModel: string;
  maxChunkSize: number;
  chunkOverlap: number;
  maxContextTokens: number;
  maxContextDocuments: number;
  supabaseUrl: string;
  supabasePrivateKey: string;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<Settings>({
    fireCrawlApiKey: "",
    anthropicApiKey: "",
    anthropicModel: "claude-3-5-sonnet-latest",
    openaiApiKey: "",
    openaiEmbeddingsModel: "text-embedding-3-large",
    maxChunkSize: 250,
    chunkOverlap: 150,
    maxContextTokens: 10000,
    supabaseUrl: "",
    supabasePrivateKey: "",
    maxContextDocuments: 100,
  });

  useEffect(() => {
    // Load saved settings when component mounts
    chrome.storage.sync.get(
      [
        "fireCrawlApiKey",
        "anthropicApiKey",
        "anthropicModel",
        "openaiApiKey",
        "openaiEmbeddingsModel",
        "maxChunkSize",
        "chunkOverlap",
        "maxContextTokens",
        "supabaseUrl",
        "supabasePrivateKey",
        "maxContextDocuments",
      ],
      (result) => {
        setSettings({
          fireCrawlApiKey: result.fireCrawlApiKey || "",
          anthropicApiKey: result.anthropicApiKey || "",
          anthropicModel: result.anthropicModel || "claude-3-5-sonnet-latest",
          openaiApiKey: result.openaiApiKey || "",
          openaiEmbeddingsModel:
            result.openaiEmbeddingsModel || "text-embedding-3-large",
          maxChunkSize: result.maxChunkSize || 250,
          chunkOverlap: result.chunkOverlap || 150,
          maxContextTokens: result.maxContextTokens || 10000,
          supabaseUrl: result.supabaseUrl || "",
          supabasePrivateKey: result.supabasePrivateKey || "",
          maxContextDocuments: result.maxContextDocuments || 100,
        });
      },
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chrome.storage.sync.set(settings, () => {
      onClose();
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: [
        "maxChunkSize",
        "chunkOverlap",
        "maxContextTokens",
        "maxContextDocuments",
      ].includes(name)
        ? parseInt(value)
        : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between w-full gap-2">
        <div className="w-full">
          <Label>Anthropic API Key</Label>
          <Input
            type="text"
            name="anthropicApiKey"
            value={settings.anthropicApiKey}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="w-full">
          <Label>Anthropic Model Name</Label>
          <Input
            type="text"
            name="anthropicModel"
            value={settings.anthropicModel}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-between w-full gap-2">
        <div className="w-full">
          <Label>OpenAI API Key</Label>
          <Input
            type="text"
            name="openaiApiKey"
            value={settings.openaiApiKey}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="w-full">
          <Label>OpenAI Embeddings Model Name</Label>
          <Input
            type="text"
            name="openaiEmbeddingsModel"
            value={settings.openaiEmbeddingsModel}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-between w-full gap-2">
        <div className="w-full">
          <Label>Supabase URL</Label>
          <Input
            type="text"
            name="supabaseUrl"
            value={settings.supabaseUrl}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <Label>Supabase Private Key</Label>
          <Input
            type="text"
            name="supabasePrivateKey"
            value={settings.supabasePrivateKey}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-between w-full gap-2">
        <div className="w-full">
          <Label>Max Chunk Size</Label>
          <Input
            type="number"
            name="maxChunkSize"
            value={settings.maxChunkSize}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <Label>Chunk Overlap</Label>
          <Input
            type="number"
            name="chunkOverlap"
            value={settings.chunkOverlap}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label>FireCrawl API Key</Label>
        <Input
          type="text"
          name="fireCrawlApiKey"
          value={settings.fireCrawlApiKey}
          onChange={handleChange}
        />
      </div>

      {/* <div>
        <Label>Max Context Tokens</Label>
        <Input
          type="number"
          name="maxContextTokens"
          value={settings.maxContextTokens}
          onChange={handleChange}
        />
      </div> */}
      <div>
        <Label>Max Context Documents</Label>
        <Input
          type="number"
          name="maxContextDocuments"
          value={settings.maxContextDocuments}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default SettingsForm;
