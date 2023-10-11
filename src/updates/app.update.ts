import { Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class AppUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply('Teammates Bot Help');
  }
}
