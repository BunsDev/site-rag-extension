"use client";

import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import { SendHorizontalIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { MarkdownText } from "./markdown-text";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

interface ThreadProps {
  queryMode: "page" | "site";
  setQueryMode: React.Dispatch<React.SetStateAction<"page" | "site">>;
  retrievalMode: "base" | "multi";
  setRetrievalMode: React.Dispatch<React.SetStateAction<"base" | "multi">>;
  contextStuff: boolean;
  setContextStuff: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Thread: FC<ThreadProps> = ({
  queryMode,
  setQueryMode,
  retrievalMode,
  setRetrievalMode,
  contextStuff,
  setContextStuff,
}) => {
  return (
    <ThreadPrimitive.Root className="bg-background h-full">
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <ThreadWelcome
          queryMode={queryMode}
          setQueryMode={setQueryMode}
          retrievalMode={retrievalMode}
          setRetrievalMode={setRetrievalMode}
          contextStuff={contextStuff}
          setContextStuff={setContextStuff}
        />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            AssistantMessage: AssistantMessage,
          }}
        />

        <div className="min-h-8 flex-grow" />

        <div className="sticky bottom-0 mt-3 flex w-full max-w-xl flex-row items-center justify-end rounded-t-lg bg-inherit pb-4">
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

function ContextStuff() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-lg font-medium">Context stuff mode</p>
      <p>
        This will scrape the current page and pass the entire contents of the
        page to the LLM without storing it in the vector store.
      </p>
      <p>
        Useful for one off questions where you know the answer is on the page
        somewhere, but you don&apos;t want to read the entire page or persist
        the context for later use.
      </p>
    </div>
  );
}

function RetrievalMode({
  queryMode,
  setQueryMode,
  retrievalMode,
  setRetrievalMode,
}: Pick<
  ThreadProps,
  "queryMode" | "setQueryMode" | "retrievalMode" | "setRetrievalMode"
>) {
  return (
    <div className="flex flex-grow gap-3 flex-col items-center justify-center">
      <div className="flex flex-col gap-3 items-start">
        <div className="flex items-center space-x-2">
          <Switch
            checked={queryMode === "site"}
            onCheckedChange={(checked) =>
              setQueryMode(checked ? "site" : "page")
            }
            id="query-mode"
          />
          <Label htmlFor="query-mode">Query Site</Label>
        </div>
        <p className="text-muted-foreground text-pretty">
          Filters indexed documents by base URL. If unchecked, will filter by
          current page URL.
        </p>
      </div>

      <div className="flex flex-col gap-3 items-start">
        <div className="flex items-center space-x-2">
          <Switch
            checked={retrievalMode === "multi"}
            onCheckedChange={(checked) =>
              setRetrievalMode(checked ? "multi" : "base")
            }
            id="retrieval-mode"
          />
          <Label htmlFor="retrieval-mode">Multi-query mode</Label>
        </div>
        <p className="text-muted-foreground text-pretty">
          Multi-query mode will generate multiple queries similar to your input
          to be used for semantic search.
        </p>
      </div>
    </div>
  );
}

const ThreadWelcome: FC<ThreadProps> = ({
  queryMode,
  setQueryMode,
  retrievalMode,
  setRetrievalMode,
  contextStuff,
  setContextStuff,
}) => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex flex-grow gap-3 flex-col items-center justify-center max-w-80">
        <div className="flex items-center justify-center">
          <Button
            variant={contextStuff ? "default" : "outline"}
            onClick={() => setContextStuff(true)}
            className="rounded-r-none"
          >
            Context Stuff
          </Button>
          <Button
            variant={contextStuff ? "outline" : "default"}
            onClick={() => setContextStuff(false)}
            className="rounded-l-none"
          >
            Retrieval Mode
          </Button>
        </div>
        {contextStuff && <ContextStuff />}
        {!contextStuff && (
          <RetrievalMode
            queryMode={queryMode}
            setQueryMode={setQueryMode}
            retrievalMode={retrievalMode}
            setRetrievalMode={setRetrievalMode}
          />
        )}
      </div>
    </ThreadPrimitive.Empty>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-aui-ring/20 flex w-full flex-row items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-muted-foreground size-full max-h-40 resize-none border-none bg-transparent p-4 pr-12 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerPrimitive.Send asChild>
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          className="my-2.5 size-8 p-2 transition-opacity ease-in"
        >
          <SendHorizontalIcon />
        </TooltipIconButton>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <div className="bg-muted text-foreground col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-4">
      <Avatar className="col-start-1 row-span-full row-start-1 mr-4">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>

      <div className="text-foreground col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
    </MessagePrimitive.Root>
  );
};
