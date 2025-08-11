import {
  ActionArguments,
  ActionFlags,
  DduItem,
} from "jsr:@shougo/ddu-vim@~10.4.0/types";
import { BaseKind } from "jsr:@shougo/ddu-vim@~10.4.0/kind";
import type { Denops } from "jsr:@denops/std@7.6.0";
import { ActionData } from "../@ddu-sources/ui_select.ts";

type Params = Record<never, never>;

export class Kind extends BaseKind<Params> {
  actions: Record<
    string,
    (args: ActionArguments<Params>) => Promise<ActionFlags>
  > = {
    select: async (args: { denops: Denops; items: DduItem[] }) => {
      const action = args.items[0]?.action as ActionData;
      await args.denops.call(
        "luaeval",
        "require('ddu-vim-ui-select').on_choice(_A.arg)",
        { arg: action.item },
      );
      return Promise.resolve(ActionFlags.None);
    },
  };

  params(): Params {
    return {};
  }
}
