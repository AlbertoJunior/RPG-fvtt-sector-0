import { EffectChangeValueType } from "../enums/enhancement-enums.mjs";

export class EnhancementUtils {
    static valueCalculators = {
        [EffectChangeValueType.FIXED]: (value, enhancementLevel) => value,
        [EffectChangeValueType.ENHANCEMENT_LEVEL]: (value, enhancementLevel) => enhancementLevel,
        [EffectChangeValueType.HALF_ENHANCEMENT_LEVEL]: (value, enhancementLevel) => Math.floor(enhancementLevel / 2),
        [EffectChangeValueType.ENHANCEMENT_LEVEL_PLUS_FIXED]: (value, enhancementLevel) => enhancementLevel + value,
        [EffectChangeValueType.HALF_ENHANCEMENT_LEVEL_PLUS_FIXED]: (value, enhancementLevel) => Math.floor(enhancementLevel / 2) + value,
    };

    static valueCalculator(typeOfValue, value, enhancementLevel) {        
        return this.valueCalculators[typeOfValue]?.(value, enhancementLevel) || 0;
    }
}