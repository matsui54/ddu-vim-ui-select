local ddu_ui_select = {}
local save_on_choice = nil

ddu_ui_select.select = function(items, opts, on_choice)
  opts = opts or {}
  opts.format_item = vim.F.if_nil(opts.format_item, function(e)
    return tostring(e)
  end)

  local indexed_items, width = (function(items_)
    local indexed_items = {}
    local max_width = 0
    for idx, item in ipairs(items_) do
      local formatted = opts.format_item(item)
      table.insert(indexed_items, { idx = idx, text = item, formatted = formatted })
      max_width = math.max(max_width, vim.fn.strdisplaywidth(formatted))
    end
    return indexed_items, max_width
  end)(items)
  save_on_choice = on_choice
  vim.fn['ddu#start']({
    sources = { {
      name = 'ui_select',
      params = { items = indexed_items }
    } },
  })
end

ddu_ui_select.on_choice = function(indexed_items)
  local on_choice = save_on_choice
  -- Note: remove `save_on_choice` before call `on_choice`
  --       because overwrite `save_on_choice` when recursive call
  --       and if do it later, breaks on_choice at inner call
  save_on_choice = nil
  vim.F.if_nil(on_choice, function(_, _)
  end)(indexed_items.text, indexed_items.idx)
end

return ddu_ui_select
