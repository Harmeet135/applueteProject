import { Controller, Post, Body, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body, @Req() req: Request, @Res() res: Response) {
    try {
      const session = await this.stripeService.createCheckoutSession(body, req.headers);
      res.status(200).json(session);
    } catch (err) {
      throw new HttpException(err.message, err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('charge')
  async createCharge(@Body() chargeParams) {
      return this.stripeService.createCharge(chargeParams.amount, chargeParams.currency, chargeParams.source, chargeParams.description);
  }
}
