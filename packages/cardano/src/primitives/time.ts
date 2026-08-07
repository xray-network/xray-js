import type * as CardanoTypes from "../types.js"

export const unixTimeToSlot = (unixTime: number, slotConfig: CardanoTypes.SlotConfig): number => {
  const timePassed = unixTime - slotConfig.zeroTime
  const slotsPassed = Math.floor(timePassed / slotConfig.slotDuration)
  return slotsPassed + slotConfig.zeroSlot
}

export const slotToUnixTime = (slot: number, slotConfig: CardanoTypes.SlotConfig): number => {
  const msAfterBegin = (slot - slotConfig.zeroSlot) * slotConfig.slotDuration
  return slotConfig.zeroTime + msAfterBegin
}
