export const locale = {
  formats: {
    l: 'DD/M/YYYY',
    L: 'DD/MM/YYYY',
    ll: 'D MMM YYYY',
    LL: 'D MMMM [năm] YYYY',
    lll: 'D MMM YYYY HH:mm',
    LLL: 'D MMMM [năm] YYYY HH:mm',
    llll: 'ddd, D MMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
  },
  months: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_'),
  monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
  name: 'vi',
  ordinal: (n: any) => n,
  relativeTime: {
    d: 'một ngày',
    dd: '%d ngày',
    future: '%s tới',
    h: 'một giờ',
    hh: '%d giờ',
    m: 'một phút',
    M: 'một tháng',
    mm: '%d phút',
    MM: '%d tháng',
    past: '%s trước',
    s: 'vài giây',
    y: 'một năm',
    yy: '%d năm',
  },
  weekdays: 'Chủ Nhật_Thứ Hai_Thứ Ba_Thứ Tư_Thứ Năm_Thứ Sáu_Thứ Bảy'.split('_'),
  weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekStart: 1,
};
