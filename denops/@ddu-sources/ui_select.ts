import { BaseSource } from "jsr:@shougo/ddu-vim@~10.4.0/source";
import { type Item } from "jsr:@shougo/ddu-vim@~10.4.0/types";
import type { Denops } from "jsr:@denops/std@7.6.0";

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
  override kind = "ui_select";

  override gather(args: {
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

  override async onEvent(args: {
    denops: Denops;
    event: string;
  }) {
    if (args.event === "cancel") {
      await args.denops.call(
        "luaeval",
        "require('ddu-vim-ui-select').on_choice({})",
      );
    }
  }

  params(): Params {
    return {};
  }
}
