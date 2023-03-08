const { Telegraf, Markup } = require("telegraf");
const dotenv = require("dotenv");

const db = require("./config/db");

const User = require("./models/User");
const Link = require("./models/Link");

const keyboards = require("./utils/markups");

dotenv.config({ path: "config/config.env" });

db();

const bot = new Telegraf(process.env.BOT_TOKEN);

//* /start
bot.start(async (ctx) => {
  const exist = await User.findOne({ chatId: ctx.chat.id });
  if (!exist) {
    await User.create({
      userId: ctx.chat.username || "none",
      chatId: ctx.chat.id,
      status: "none",
    });
  }

  ctx.reply(
    `Welcome ${ctx.chat.first_name} to Trackable Link Generator Bot\nHow to use: /help`,
    { reply_markup: keyboards.mainKeyboard }
  );
});

//* /help
bot.command("help", (ctx) => {
  ctx.reply("...", { reply_to_message_id: ctx.message.message_id });
});

bot.hears("➕ Create New", async (ctx) => {
  const user = await User.findOne({ chatId: ctx.chat.id });

  //? checking user is in right status to use this function
  if (user.status == "none") {
    ctx.reply("OK! Enter your link...", {
      reply_markup: Markup.removeKeyboard().reply_markup,
    });

    user.status = "creating";
    await user.save();
  }
});

bot.on("message", async (ctx) => {
  const user = await User.findOne({ chatId: ctx.chat.id });

  //? checking user is in right status to use this function
  if (user.status == "creating" && ctx.message.text.startsWith("http")) {
    //? make links clean
    let link = ctx.message.text.split(" ")[0];
    if (link.includes("www")) link = link.slice(link.indexOf("www.") + 4);
    else link = link.split("//")[1];

    //? checking if its already exist
    const exist = await Link.findOne({ creator: user._id, link });
    if (exist)
      return ctx.reply("This link is currently exist!", {
        reply_to_message_id: ctx.message.message_id,
      });

    await ctx.reply("creating...", {
      reply_to_message_id: ctx.message.message_id,
    });

    //? a delay just for fun :)
    setTimeout(async () => {
      await Link.create({ creator: user._id, link });

      user.status = "none";
      await user.save();

      ctx.reply(`http://localhost:3000/link/${link}`, {
        reply_markup: keyboards.mainKeyboard,
      });
    }, 2000);
  }
});

bot.launch();

//* Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
