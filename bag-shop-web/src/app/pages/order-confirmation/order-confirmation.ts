import { Component, inject } from '@angular/core';
import { OrderStateService } from '../../services/order-state-service';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  imports: [RouterLink,
    DecimalPipe, DatePipe],
  selector: 'app-order-confirmation',
  styleUrl: './order-confirmation.css',
  templateUrl: './order-confirmation.html',
})
export class OrderConfirmation {

  protected orderState = inject(OrderStateService);

  printReceipt(): void {

    const receipt = document.getElementById('receipt');

    if (!receipt) {
      return;
    }

    const printWindow = window.open('', '', 'width=800,height=900');

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>

        <title>Order Receipt</title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 30px;
            background: white;
            color: #000;
          }

          @page {
            margin: 10mm;
          }

        </style>

      </head>

      <body>

        ${receipt.outerHTML}

      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {

      // printWindow.print();

      //printWindow.close();

    }, 500);

  }
}
