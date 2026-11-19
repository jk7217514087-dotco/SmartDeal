import React from 'react';
import { Order } from '../../types';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileCheck2,
  QrCode
} from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Calculations for tax breakup (assuming standard 18% GST: 9% CGST + 9% SGST inclusive)
  const taxableAmount = Math.round(order.finalAmount / 1.18);
  const totalGst = order.finalAmount - taxableAmount;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Header Actions - Hidden on Print */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">Tax Invoice & Delivery Receipt</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs">
          {/* Company Branding & Tax Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  SD
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Smart<span className="text-brand-600">Deals</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                “Smart Shopping. Better Deals. Every Time.”
              </p>
              <div className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                <strong>SmartDeals Technologies Pvt Ltd</strong><br />
                DLF Cyber City, Tower B, Level 8, Gurugram, HR - 122002<br />
                CIN: U72900HR2024PTC099881 | GSTIN: <strong className="text-slate-800 font-mono">06AABCS9876Q1Z2</strong><br />
                FSSAI / BIS Certified E-Commerce Marketplace
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="inline-block px-3 py-1 rounded-md bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wider text-[11px] border border-slate-200">
                TAX INVOICE
              </div>
              <div className="mt-2 space-y-0.5 text-[11px]">
                <div><span className="text-slate-400">Invoice No: </span><strong className="font-mono text-slate-900">SD-INV-2026-{order.id}</strong></div>
                <div><span className="text-slate-400">Order ID: </span><strong className="font-mono text-slate-900">#{order.id}</strong></div>
                <div><span className="text-slate-400">Invoice Date: </span><strong className="text-slate-900">{order.date}</strong></div>
                <div><span className="text-slate-400">Place of Supply: </span><strong className="text-slate-900">Delhi (State Code: 07)</strong></div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-200">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Billed To (Customer)
              </div>
              <div className="font-black text-slate-900 text-sm">{order.shippingAddress.fullName}</div>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                Phone: +91 {order.shippingAddress.phone}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Seller & Fulfillment Partner
              </div>
              <div className="font-black text-slate-900 text-sm">
                {order.items[0]?.sellerName || 'SmartDeals Prime Retail'}
              </div>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                Fulfillment Hub: SmartDeals Logistics Park, Okhla Phase III<br />
                Courier Partner: {order.deliveryPartner} (AWB: <span className="font-mono font-bold text-slate-800">{order.trackingId}</span>)<br />
                Payment Mode: <strong className="text-emerald-700">{order.paymentMethod} (PAID)</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Taxable Amt</th>
                  <th className="py-2.5 px-3 text-right">GST (18%)</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {order.items.map((item, index) => {
                  const itemTotal = item.price * item.quantity;
                  const itemTaxable = Math.round(itemTotal / 1.18);
                  const itemGst = itemTotal - itemTaxable;

                  return (
                    <tr key={index}>
                      <td className="py-3 px-3 text-slate-400">{index + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.productName}</div>
                        <div className="text-[10px] text-slate-400">Sold by {item.sellerName} • SmartDeals Verified</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">8517.13</td>
                      <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono">₹{itemTaxable.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">₹{itemGst.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary & Tax Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SmartDeals Buyer Protection</span>
                </div>
                <p className="text-emerald-800">
                  This transaction is covered under 100% Genuine Product and Verified Invoice Guarantee.
                </p>
              </div>

              <div className="text-[10px] text-slate-400 space-y-1">
                <div>Terms & Conditions:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Goods once sold can be returned within 7 days of delivery under SmartDeals Buyer Guarantee.</li>
                  <li>This is a computer-generated tax invoice and requires no physical signature under Indian IT Act 2000.</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%):</span>
                <span className="font-mono">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%):</span>
                <span className="font-mono">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Delivery Fee:</span>
                <span className="text-emerald-700 font-bold">FREE (₹0)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-black text-slate-900 text-sm">Total Paid:</span>
                <span className="text-base font-black text-brand-600 font-mono">
                  ₹{order.finalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Verification Block */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center p-1">
                <QrCode className="w-10 h-10 text-slate-700" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">GST IRN / QR Digital Seal</div>
                <div className="text-[11px] font-bold text-slate-800">Verified Invoice Authenticity</div>
                <div className="text-[10px] text-slate-400">Scan using GST E-Invoice app</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">For SmartDeals Technologies Pvt Ltd</div>
              <div className="h-8 flex items-end justify-end">
                <span className="font-serif italic font-bold text-indigo-900 text-sm">Authorized Signatory</span>
              </div>
              <div className="text-[10px] text-slate-400">Digitally signed & encrypted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
