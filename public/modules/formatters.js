export function formatExpiryDate(value) {
  return value
    .replace(
      /[^0-9]/g,
      "" // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      "0$1" // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      "0$1 / $2" // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      "0" // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      "$1 / $2" // To handle 113 > 11/3
    );
}

export function formatCardNumber(value) {
  const ccNumString = value.replace(/[^0-9]/g, "");
  // mc, starts with - 51 to 55
  // v, starts with - 4
  // dsc, starts with 6011, 622126-622925, 644-649, 65
  // amex, starts with 34 or 37
  let typeCheck = ccNumString.substring(0, 2);
  let cType = "";
  let block1 = "";
  let block2 = "";
  let block3 = "";
  let block4 = "";
  let formatted = "";

  if (typeCheck.length == 2) {
    typeCheck = parseInt(typeCheck);
    if (typeCheck >= 40 && typeCheck <= 49) {
      cType = "VISA";
    } else if (typeCheck >= 51 && typeCheck <= 55 || typeCheck == 22) {
      cType = "MASTER";
    } else if (typeCheck == 34 || typeCheck == 37) {
      cType = "AMEX";
    } else {
      cType = "Invalid";
    }
  }

  // all support card types have a 4 digit firt block
  block1 = ccNumString.substring(0, 4);
  if (block1.length == 4) {
    block1 = block1 + " ";
  }

  if (cType === "VISA" || cType === "MASTER") {
    // for 4X4 cards
    block2 = ccNumString.substring(4, 8);
    if (block2.length === 4) {
      block2 = block2 + " ";
    }
    block3 = ccNumString.substring(8, 12);
    if (block3.length === 4) {
      block3 = block3 + " ";
    }
    block4 = ccNumString.substring(12, 16);
  } else if (cType === "AMEX") {
    // for Amex cards
    block2 = ccNumString.substring(4, 10);
    if (block2.length === 6) {
      block2 = block2 + " ";
    }
    block3 = ccNumString.substring(10, 15);
    block4 = "";
  } else if (cType === "Invalid") {
    // for Amex cards
    block1 = typeCheck;
    block2 = "";
    block3 = "";
    block4 = "";
    console.error("Invalid Card Number");
  }

  formatted = block1 + block2 + block3 + block4;
  return { formatted, type: cType };
}
