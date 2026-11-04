export const fonts = {
  bebasNeue: 'BebasNeue_400Regular',
  bodyRegular: 'Poppins_400Regular',
  bodyMedium: 'Poppins_500Medium',
  bodySemiBold: 'Poppins_600SemiBold',
} as const;

export const typography = {
  title: {
    fontFamily: fonts.bebasNeue,
    fontSize: 34,
    letterSpacing: 0.5,
  },
  heading: {
    fontFamily: fonts.bebasNeue,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fonts.bebasNeue,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  button: {
    fontFamily: fonts.bebasNeue,
    fontSize: 18,
    letterSpacing: 1,
  },
  caption: {
    fontFamily: fonts.bebasNeue,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  body: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
  },
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  bodySemiBold: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  bodySmall: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
  },
} as const;
