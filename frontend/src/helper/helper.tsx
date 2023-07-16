export const converter = (wei: string) => {
  if (wei === undefined) return;
  const weiValue = BigInt(wei);
  const etherValue = Number(weiValue) / 1e18;
  return etherValue.toString();
};

export const formatAddress = (address: string) => {
  if (typeof address !== "string" || address.length !== 42) {
    throw new Error("Invalid address format");
  }

  const firstFour = address.substring(0, 6);
  const lastFour = address.substring(address.length - 4);

  return `0x${firstFour}...${lastFour}`;
};
