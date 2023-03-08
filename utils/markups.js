const { Markup } = require("telegraf");

const mainKeyboard = Markup.keyboard([
  [
    Markup.button.callback("➕ Create New", "➕ Create New"),
    Markup.button.callback("🔗 My links", "🔗 My links"),
  ],
]).reply_markup;

exports.mainKeyboard = mainKeyboard;
