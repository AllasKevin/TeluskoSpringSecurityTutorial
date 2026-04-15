import { describe, it, expect } from 'vitest';
import { TAB_TYPES, COLORS, BUTTON_STYLES, SPACING, FONT_SIZES } from './bookingConstants';

describe('TAB_TYPES', () => {
  it('contains all expected tab types', () => {
    expect(TAB_TYPES.SCHEDULE).toBe('schedule');
    expect(TAB_TYPES.AVAILABLE).toBe('available');
    expect(TAB_TYPES.MY_BOOKINGS).toBe('mybookings');
  });
});

describe('COLORS', () => {
  it('defines all required color values as valid hex strings', () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    Object.values(COLORS).forEach((color) => {
      expect(color).toMatch(hexPattern);
    });
  });
});

describe('BUTTON_STYLES', () => {
  it('each style has backgroundColor and white text', () => {
    Object.values(BUTTON_STYLES).forEach((style) => {
      expect(style).toHaveProperty('backgroundColor');
      expect(style.color).toBe('white');
    });
  });

  it('uses matching COLORS values', () => {
    expect(BUTTON_STYLES.PRIMARY.backgroundColor).toBe(COLORS.PRIMARY);
    expect(BUTTON_STYLES.SUCCESS.backgroundColor).toBe(COLORS.SUCCESS);
    expect(BUTTON_STYLES.DANGER.backgroundColor).toBe(COLORS.DANGER);
    expect(BUTTON_STYLES.SECONDARY.backgroundColor).toBe(COLORS.SECONDARY);
  });
});

describe('SPACING', () => {
  it('defines all spacing values as px strings', () => {
    Object.values(SPACING).forEach((value) => {
      expect(value).toMatch(/^\d+px$/);
    });
  });
});

describe('FONT_SIZES', () => {
  it('defines all font sizes as rem strings', () => {
    Object.values(FONT_SIZES).forEach((value) => {
      expect(value).toMatch(/^\d+(\.\d+)?rem$/);
    });
  });
});
