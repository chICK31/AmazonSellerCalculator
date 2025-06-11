function calculate() {
  const productCost = parseFloat(document.getElementById("productCost").value) || 0;
  const sellingPrice = parseFloat(document.getElementById("sellingPrice").value) || 0;
  const fulfillmentFee = parseFloat(document.getElementById("fulfillmentFee").value) || 0;
  const unitsPerMonth = parseInt(document.getElementById("unitsPerMonth").value) || 1;
  const returnsPerMonthRaw = parseInt(document.getElementById("returnsPerMonth").value) || 0;
  const returnsPerMonth = Math.min(returnsPerMonthRaw, unitsPerMonth); // prevent over-returns
  const cubicFeet = parseFloat(document.getElementById("cubicFeet").value) || 0;

  // Fee checkboxes
  const includePro = document.getElementById("includePro").checked;
  const includeStorage = document.getElementById("includeStorage").checked;
  const includeLabeling = document.getElementById("includeLabeling").checked;
  const includePrep = document.getElementById("includePrep").checked;
  const includeAged = document.getElementById("includeAged").checked;
  const includeRemoval = document.getElementById("includeRemoval").checked;

  // Base + Optional Fees
  const referralFee = sellingPrice * 0.15;
  const proFee = includePro ? 39.99 / unitsPerMonth : 0;
  const storageFee = includeStorage ? (0.87 * cubicFeet) : 0;
  const labelingFee = includeLabeling ? 0.30 : 0;
  const prepFee = includePrep ? 1.00 : 0;
  const agedFee = includeAged ? 0.50 : 0;
  const removalFee = includeRemoval ? 0.50 : 0;

  const optionalFees = proFee + storageFee + labelingFee + prepFee + agedFee + removalFee;
  const totalCostPerUnit = productCost + fulfillmentFee + referralFee + optionalFees;

  // Return handling
    const returnFeePerUnit = fulfillmentFee; // always applied
  const totalReturnCost = returnFeePerUnit * returnsPerMonth;

  // Profit calculations
  const profitPerUnit = sellingPrice - totalCostPerUnit;
  const grossProfit = profitPerUnit * unitsPerMonth;
  const netProfitAfterReturns = grossProfit - totalReturnCost;

  // Additional metrics
  const breakEvenItemCost = sellingPrice - (totalCostPerUnit - productCost);
  const marginPercent = (profitPerUnit / sellingPrice) * 100;

  // Display
  document.getElementById("results").innerHTML = `
    <strong>Revenue per Unit:</strong> $${sellingPrice.toFixed(2)}<br>
    <strong>Total Item Cost (${unitsPerMonth} units):</strong> $${(productCost * unitsPerMonth).toFixed(2)}<br>
    <strong>Total Cost per Unit (with fees):</strong> $${totalCostPerUnit.toFixed(2)}<br>
    <strong>Profit per Unit:</strong> $${profitPerUnit.toFixed(2)}<br>
    <strong>Profit Margin:</strong> ${marginPercent.toFixed(2)}%<br>
    <strong>Gross Monthly Profit (${unitsPerMonth} units):</strong> $${grossProfit.toFixed(2)}<br>
    <strong>Return Costs (${returnsPerMonth} returns):</strong> -$${totalReturnCost.toFixed(2)}<br>
    <strong>Max Item Cost to Break Even:</strong> $${breakEvenItemCost.toFixed(2)}<br>
    <strong><u>Net Monthly Profit After Returns:</u></strong> $${netProfitAfterReturns.toFixed(2)}
  `;

  // Visual warning if losing money
  document.getElementById("results").style.color = netProfitAfterReturns < 0 ? "red" : "green";
}
// Auto-trigger calculate on all inputs and checkboxes
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", calculate);
      input.addEventListener("change", calculate);
    });
    calculate(); // initial run
  }, 50); // slight delay to ensure DOM is ready
});
