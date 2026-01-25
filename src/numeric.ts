/**
 * Minimal numeric utilities for ECMA-55 BASIC
 * Only handles mandatory requirements
 */

/**
 * REQUIRED: Format number for PRINT statement
 * Must include leading space/minus and trailing space
 */
export function formatNumber(value: number): string {
  // Handle special values
  if (!isFinite(value)) {
    return value > 0 ? " Infinity " : " -Infinity ";
  }

  const sign = value >= 0 ? " " : "-";
  const absValue = Math.abs(value);

  // Integer with 6 or fewer digits? Use simple format
  if (Number.isInteger(absValue) && absValue < 1e6) {
    return `${sign}${Math.floor(absValue)} `;
  }

  // For other numbers, use JavaScript's default with some formatting
  // Remove trailing zeros for cleaner output
  let formatted = absValue.toString();
  if (formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }
  
  return `${sign}${formatted} `;
}


/**
 * REQUIRED: Negative^NonInteger must throw fatal error
 */
export function safePower(base: number, exponent: number): number {
  // Fatal error case (MANDATORY)
  if (base < 0 && !Number.isInteger(exponent)) {
    throw new Error("Fatal: negative number raised to non-integral power");
  }
  
  // 0^0 = 1 by definition
  if (base === 0 && exponent === 0) {
    return 1;
  }

  return Math.pow(base, exponent);
}
