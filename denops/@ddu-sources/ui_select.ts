import { BaseSource, Item } from "https://deno.land/x/ddu_vim@v1.7.0/types.ts";
import { Denops } from "https://deno.land/x/ddu_vim@v1.7.0/deps.ts";

type SelectItem = {
  idx: number;
  text: string;
  formatted: string;
};

type Params = {
  items?: SelectItem[];
};

export type ActionData = {
  item: SelectItem;
};

export class Source extends BaseSource<Params> {
  kind = "ui_select";

  gather(args: {
    denops: Denops;
    sourceParams: Params;
  }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      start(controller) {
        if (args.sourceParams.items) {
          controller.enqueue(
            args.sourceParams.items.map((i) => ({
              word: i.formatted,
              action: { item: i },
            })),
          );
        }
        controller.close();
      },
    });
  }

  params(): Params {
    return {};
  }
}
