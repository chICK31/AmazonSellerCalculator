function calculate() {
  const get = id => parseFloat(document.getElementById(id).value) || 0;
  const getInt = id => parseInt(document.getElementById(id).value) || 0;

  const productCost = get("productCost");
  const sellingPrice = get("sellingPrice");
  const fulfillmentFee = get("fulfillmentFee");
  const unitsPerMonth = getInt("unitsPerMonth");
  const returnsPerMonth = Math.min(getInt("returnsPerMonth"), unitsPerMonth);
  const cubicFeet = get("cubicFeet");
  const packagingCost = get("packagingCost");
  const unitsSold = getInt("unitsSold");

  const isFBA = document.getElementById("toggleFBA").checked;
  const shippingCost = get("shippingCost");
  const sellerPaysShipping = document.getElementById("sellerPaysShipping").checked;

  const getChecked = id => document.getElementById(id).checked;
  const optionalFees = 
    (getChecked("includePro") ? 39.99 / unitsPerMonth : 0) +
    (isFBA && getChecked("includeStorage") ? 0.87 * cubicFeet : 0) +
    (isFBA && getChecked("includeLabeling") ? 0.30 : 0) +
    (isFBA && getChecked("includePrep") ? 1.00 : 0) +
    (isFBA && getChecked("includeAged") ? 0.50 : 0) +
    (isFBA && getChecked("includeRemoval") ? 0.50 : 0);

  const referralFee = sellingPrice * 0.15;
  const shippingFee = sellerPaysShipping ? shippingCost : 0;
  const fbaFee = isFBA ? fulfillmentFee : 0;

  const totalCostPerUnit = productCost + fbaFee + referralFee + optionalFees + packagingCost + shippingFee;
  const profitPerUnit = sellingPrice - totalCostPerUnit;
  const returnCost = isFBA ? fulfillmentFee : (sellerPaysShipping ? sellingPrice + shippingCost : sellingPrice);

  // Monthly
  const grossMonthlyProfit = profitPerUnit * unitsPerMonth;
  const returnLoss = returnCost * returnsPerMonth;
  const netMonthlyProfit = grossMonthlyProfit - returnLoss;

  // Lifetime
  const totalRevenue = sellingPrice * unitsSold;
  const totalNetProfit = profitPerUnit * unitsSold;

  const breakEvenItemCost = sellingPrice - (totalCostPerUnit - productCost);
  const marginPercent = (profitPerUnit / sellingPrice) * 100;

  // Display
  document.getElementById("results").innerHTML = `
    <strong>Revenue per Unit:</strong> $${sellingPrice.toFixed(2)}<br>
    <strong>Total Item Cost (${unitsPerMonth} units):</strong> $${(productCost * unitsPerMonth).toFixed(2)}<br>
    <strong>Total Cost per Unit (with fees):</strong> $${totalCostPerUnit.toFixed(2)}<br>
    <strong>Profit per Unit:</strong> $${profitPerUnit.toFixed(2)}<br>
    <strong>Profit Margin:</strong> ${marginPercent.toFixed(2)}%<br>
    <strong>Gross Monthly Profit (${unitsPerMonth} units):</strong> $${grossMonthlyProfit.toFixed(2)}<br>
    <strong>Return Costs (${returnsPerMonth} returns):</strong> -$${returnLoss.toFixed(2)}<br>
    <strong>Max Item Cost to Break Even:</strong> $${breakEvenItemCost.toFixed(2)}<br>
    <strong><u>Net Monthly Profit After Returns:</u></strong> $${netMonthlyProfit.toFixed(2)}<br>
    <strong>Total Revenue (${unitsSold} units sold):</strong> $${totalRevenue.toFixed(2)}<br>
    <strong>Total Net Profit:</strong> $${totalNetProfit.toFixed(2)}<br>
  `;

  document.getElementById("results").style.color = netMonthlyProfit < 0 ? "red" : "green";

  // Show/hide FBA fields
  document.getElementById("fbaFields").style.display = isFBA ? "block" : "none";

  const fulfillmentFeeInput = document.getElementById("fulfillmentFee");
  fulfillmentFeeInput.disabled = !isFBA;
  fulfillmentFeeInput.style.backgroundColor = isFBA ? "white" : "#ddd";
  if (!isFBA) fulfillmentFeeInput.value = 0;
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", calculate);
      input.addEventListener("change", calculate);
    });
    calculate(); // initial run
  }, 50);
});
