import { SelectProps, StepProps } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
export const instructionOptions: SelectProps['options'] = [
  {
    label: 'Gọi khách trước khi giao',
    value: 'Gọi khách trước khi giao',
  },
  {
    label: 'Hoàn hàng: tự động lưu kho chờ check',
    value: 'Hoàn hàng: tự động lưu kho chờ check',
  },
  {
    label: 'Chuyển hoàn sau 3 lần phát',
    value: 'Chuyển hoàn sau 3 lần phát',
  },
  {
    label: 'Cho xem hàng, không cho thử, có vấn đề gọi về shop',
    value: 'Cho xem hàng, không cho thử, có vấn đề gọi về shop',
  },
  {
    label: 'Cho xem hàng, cho thử, có vấn đề gọi về shop',
    value: 'Cho xem hàng, cho thử, có vấn đề gọi về shop',
  },
  {
    label: 'Không cho xem hàng, có vấn đề gọi về shop',
    value: 'Không cho xem hàng, có vấn đề gọi về shop',
  },
  {
    label: 'Gọi khách trước khi giao',
    value: 'Gọi khách trước khi giao',
  },
  {
    label: 'Giao hàng 1 phần, trả 1 phần',
    value: 'Giao hàng 1 phần, trả 1 phần',
  },
];

export const carrierOptions: SelectProps['options'] = [
  {
    label: 'Ninja Van',
    value: 'NINJAVAN',
  },
  {
    label: 'Giao Hàng Nhanh',
    value: 'GHN',
  },
  {
    label: 'Giao Hàng Tiết Kiệm',
    value: 'GHTK',
  },
];

export const conciliationStepItems: StepProps[] = [
  {
    description: 'Các đơn chờ xử lý',
    title: 'Đang đối soát',
  },
  {
    description: 'Các đơn đã đối soát',
    title: 'Đã  đối soát',
  },
  {
    description: 'Các đơn đối soát đã hủy',
    title: 'Đã  hủy',
  },
];

export const orderStatusOptions: SelectProps['options'] = [
  { label: 'Đang chờ lấy hàng', value: 'Đang chờ lấy hàng' },
  { label: 'Đang vận chuyển', value: 'Đang vận chuyển' },
  { label: 'Vận chuyển thất bại', value: 'Vận chuyển thất bại' },
  { label: 'Trả lại cho người gửi', value: 'Trả lại cho người gửi' },
  { label: 'Giao hàng thành công', value: 'Giao hàng thành công' },
  { label: 'Đơn hàng hủy', value: 'Đơn hàng hủy' },
];
export const orderStatusReconciliationOptions: SelectProps['options'] = [
  { label: 'Chưa đối soát', value: 0 },
  { label: 'Đã đối soát', value: 1 },
];

export const zoneOptions: SelectProps['options'] = [
  { label: 'Nội Tỉnh', value: 'Nội Tỉnh' },
  { label: 'Nội Vùng', value: 'Nội Vùng' },
  { label: 'Liên Vùng', value: 'Liên Vùng' },
  { label: 'Hồ Chí Minh', value: 'Hồ Chí Minh' },
  { label: 'Hà Nội', value: 'Hà Nội' },
];

export const zonePickOptions: CheckboxGroupProps['options'] = [
  { label: 'HCM', value: 'HCM' },
  { label: 'HN', value: 'HN' },
  { label: 'MN', value: 'MN' },
  { label: 'MB', value: 'MB' },
  { label: 'MT', value: 'MT' },
];

export const bankOptions = [
  {
    label: 'JPMORGAN CHASE BANK, N.A., HO CHI MINH CITY BRANCH',
    value: 'JPMORGAN CHASE BANK, N.A., HO CHI MINH CITY BRANCH',
  },
  {
    label: 'Shanghai Hongqiao Sub-Branch',
    value: 'Shanghai Hongqiao Sub-Branch',
  },
  {
    label: 'BNP Paribas CN HCM',
    value: 'BNP Paribas CN HCM',
  },
  {
    label: 'Bank of Ningbo Suzhou Branch',
    value: 'Bank of Ningbo Suzhou Branch',
  },
  {
    label: 'VDB - Ngân hàng Phát triển Việt Nam',
    value: 'VDB - Ngân hàng Phát triển Việt Nam',
  },
  {
    label: 'VBSP - Ngân Hàng Chính Sách Xã Hội Việt Nam',
    value: 'VBSP - Ngân Hàng Chính Sách Xã Hội Việt Nam',
  },
  {
    label: 'BPCEIOM - BPCEIOM VN CN HCM',
    value: 'BPCEIOM - BPCEIOM VN CN HCM',
  },
  {
    label: 'Co-opbank - Ngân hàng hợp tác xã Việt Nam',
    value: 'Co-opbank - Ngân hàng hợp tác xã Việt Nam',
  },
  {
    label: 'Citibank - Citibank N.A., Singapore Branch',
    value: 'Citibank - Citibank N.A., Singapore Branch',
  },
  {
    label: 'BoA - Bank of America Europe DAC',
    value: 'BoA - Bank of America Europe DAC',
  },
  {
    label: 'CBBank - Ngân Hàng Xây dựng',
    value: 'CBBank - Ngân Hàng Xây dựng',
  },
  {
    label: 'Ngân hàng Mizuho CN TP Hồ Chí Minh',
    value: 'Ngân hàng Mizuho CN TP Hồ Chí Minh',
  },
  {
    label: 'VTP - ViettelPay',
    value: 'VTP - ViettelPay',
  },
  {
    label: 'PVCombank - Ngân hàng TMCP Đại Chúng Việt Nam',
    value: 'PVCombank - Ngân hàng TMCP Đại Chúng Việt Nam',
  },
  {
    label: 'Ngân hàng Woori Việt Nam',
    value: 'Ngân hàng Woori Việt Nam',
  },
  {
    label: 'NCB - Ngân Hàng Quốc Dân',
    value: 'NCB - Ngân Hàng Quốc Dân',
  },
  {
    label: 'LVB - Ngân hàng liên doanh Lào - Việt',
    value: 'LVB - Ngân hàng liên doanh Lào - Việt',
  },
  {
    label: 'VSB - NH Việt - Thái',
    value: 'VSB - NH Việt - Thái',
  },
  {
    label: 'NH VID Public Bank',
    value: 'NH VID Public Bank',
  },
  {
    label: 'Shinhanvina - Ngân hàng TNHH một thành viên Shinhanvina',
    value: 'Shinhanvina - Ngân hàng TNHH một thành viên Shinhanvina',
  },
  {
    label: 'VRB - Ngân hàng Liên doanh Việt -Nga',
    value: 'VRB - Ngân hàng Liên doanh Việt -Nga',
  },
  {
    label: 'IVB - Ngân hàng trách nhiệm hữu hạn Indovina',
    value: 'IVB - Ngân hàng trách nhiệm hữu hạn Indovina',
  },
  {
    label: 'UOB - Ngân hàng United Overseas Bank Việt Nam',
    value: 'UOB - Ngân hàng United Overseas Bank Việt Nam',
  },
  {
    label: 'Ca-CIB - Ngân hàng Credit Agricole Corporate and Investment Bank',
    value: 'Ca-CIB - Ngân hàng Credit Agricole Corporate and Investment Bank',
  },
  {
    label: 'BIDC - NGÂN HÀNG ĐẦU TƯ VÀ PHÁT TRIỂN CAMPUCHIA',
    value: 'BIDC - NGÂN HÀNG ĐẦU TƯ VÀ PHÁT TRIỂN CAMPUCHIA',
  },
  {
    label: 'HLBVN - Ngân hàng TNHH MTV Hong Leong VN',
    value: 'HLBVN - Ngân hàng TNHH MTV Hong Leong VN',
  },
  {
    label: 'Shinhan Bank - Ngân hàng TNHH MTV Shinhan Việt Nam',
    value: 'Shinhan Bank - Ngân hàng TNHH MTV Shinhan Việt Nam',
  },
  {
    label: 'Standard Chartered - NH Standard Chartered',
    value: 'Standard Chartered - NH Standard Chartered',
  },
  {
    label: 'HSBC - NH TNHH một thành viên HSBC Việt Nam',
    value: 'HSBC - NH TNHH một thành viên HSBC Việt Nam',
  },
  {
    label: 'Citibank - Ngân hàng Citibank Việt Nam',
    value: 'Citibank - Ngân hàng Citibank Việt Nam',
  },
  {
    label: 'Deutsche Bank AG, Vietnam - Ngân hàng Deutsche Bank AG',
    value: 'Deutsche Bank AG, Vietnam - Ngân hàng Deutsche Bank AG',
  },
  {
    label: 'NH ANZ Việt Nam',
    value: 'NH ANZ Việt Nam',
  },
  {
    label: 'MHB - NH Phát triển Nhà Đồng bằng sông Cửu Long',
    value: 'MHB - NH Phát triển Nhà Đồng bằng sông Cửu Long',
  },
  {
    label: 'BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam',
    value: 'BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam',
  },
  {
    label: 'Trustbank - Ngân hàng TMCP Đại Tín',
    value: 'Trustbank - Ngân hàng TMCP Đại Tín',
  },
  {
    label: 'Mekong Bank - Ngân hàng TMCP Phát triển Mê Kông',
    value: 'Mekong Bank - Ngân hàng TMCP Phát triển Mê Kông',
  },
  {
    label: 'LienVietPostBank - Ngân Hàng TMCP Bưu Điện Liên Việt',
    value: 'LienVietPostBank - Ngân Hàng TMCP Bưu Điện Liên Việt',
  },
  {
    label: 'PGBank - Ngân Hàng TMCP Xăng Dầu Petrolimex',
    value: 'PGBank - Ngân Hàng TMCP Xăng Dầu Petrolimex',
  },
  {
    label: 'Vietbank - Ngân Hàng TMCP Việt Nam Thương Tín',
    value: 'Vietbank - Ngân Hàng TMCP Việt Nam Thương Tín',
  },
  {
    label: 'BaoViet Bank - Ngân hàng TMCP Bảo Việt',
    value: 'BaoViet Bank - Ngân hàng TMCP Bảo Việt',
  },
  {
    label: 'Viet A Bank - Ngân hàng TMCP Việt Á',
    value: 'Viet A Bank - Ngân hàng TMCP Việt Á',
  },
  {
    label: 'SHB - Ngân Hàng TMCP Sài Gòn - Hà Nội',
    value: 'SHB - Ngân Hàng TMCP Sài Gòn - Hà Nội',
  },
  {
    label: 'Saigonbank - Ngân Hàng TMCP Sài Gòn Công Thương',
    value: 'Saigonbank - Ngân Hàng TMCP Sài Gòn Công Thương',
  },
  {
    label: 'SCB - Ngân Hàng TMCP Sài Gòn',
    value: 'SCB - Ngân Hàng TMCP Sài Gòn',
  },
  {
    label: 'VIBank - Ngân hàng TMCP Quốc tế Việt Nam',
    value: 'VIBank - Ngân hàng TMCP Quốc tế Việt Nam',
  },
  {
    label: 'Western Bank - Ngân hàng TMCP Phương Tây',
    value: 'Western Bank - Ngân hàng TMCP Phương Tây',
  },
  {
    label: 'MB - NH Quân Đội',
    value: 'MB - NH Quân Đội',
  },
  {
    label: 'OCB - Ngân Hàng TMCP Phương Đông Việt Nam',
    value: 'OCB - Ngân Hàng TMCP Phương Đông Việt Nam',
  },
  {
    label: 'Southern Bank - Ngân hàng TMCP Phương Nam',
    value: 'Southern Bank - Ngân hàng TMCP Phương Nam',
  },
  {
    label: 'HDBank - Ngân hàng TMCP Phát triển TPHCM',
    value: 'HDBank - Ngân hàng TMCP Phát triển TPHCM',
  },
  {
    label: 'VP Bank - Ngân hàng Việt Nam Thịnh vượng',
    value: 'VP Bank - Ngân hàng Việt Nam Thịnh vượng',
  },
  {
    label: 'NaViBank - Ngân hàng TMCP Nam Việt',
    value: 'NaViBank - Ngân hàng TMCP Nam Việt',
  },
  {
    label: 'Nam A Bank - Ngân hàng TMCP Nam Á',
    value: 'Nam A Bank - Ngân hàng TMCP Nam Á',
  },
  {
    label: 'KienLongBank - Ngân hàng TMCP Kiên Long',
    value: 'KienLongBank - Ngân hàng TMCP Kiên Long',
  },
  {
    label: 'Viet Capital Bank - Ngân hàng TMCP Bản Việt',
    value: 'Viet Capital Bank - Ngân hàng TMCP Bản Việt',
  },
  {
    label: 'GP.Bank - Ngân hàng TM TNHH MTV Dầu Khí Toàn Cầu',
    value: 'GP.Bank - Ngân hàng TM TNHH MTV Dầu Khí Toàn Cầu',
  },
  {
    label: 'Bac A Bank - Ngân hàng TMCP Bắc Á',
    value: 'Bac A Bank - Ngân hàng TMCP Bắc Á',
  },
  {
    label: 'ABBank - Ngân hàng TMCP An Bình',
    value: 'ABBank - Ngân hàng TMCP An Bình',
  },
  {
    label: 'OceanBank - Ngân hàng TMCP Đại Dương',
    value: 'OceanBank - Ngân hàng TMCP Đại Dương',
  },
  {
    label: 'SeABank - Ngân hàng TMCP Đông Nam Á',
    value: 'SeABank - Ngân hàng TMCP Đông Nam Á',
  },
  {
    label: 'DaiABank - Ngân hàng TMCP Đại Á',
    value: 'DaiABank - Ngân hàng TMCP Đại Á',
  },
  {
    label: 'Eximbank - Ngân hàng thương mại cổ phần Xuất Nhập Khẩu Việt Nam',
    value: 'Eximbank - Ngân hàng thương mại cổ phần Xuất Nhập Khẩu Việt Nam',
  },
  {
    label: 'Tien Phong Bank - Ngân hàng TMCP Tiên Phong',
    value: 'Tien Phong Bank - Ngân hàng TMCP Tiên Phong',
  },
  {
    label: 'ANZ - Ngân hàng TNHH một thành viên ANZ Việt Nam',
    value: 'ANZ - Ngân hàng TNHH một thành viên ANZ Việt Nam',
  },
  {
    label: 'Vietinbank - Ngân hàng Công thương Việt Nam',
    value: 'Vietinbank - Ngân hàng Công thương Việt Nam',
  },
  {
    label: 'Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
    value: 'Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
  },
  {
    label: 'Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín',
    value: 'Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín',
  },
  {
    label: 'Maritime Bank - Ngân hàng TMCP Hàng Hải Việt Nam',
    value: 'Maritime Bank - Ngân hàng TMCP Hàng Hải Việt Nam',
  },
  {
    label: 'ACB - Ngân hàng TMCP Á Châu',
    value: 'ACB - Ngân hàng TMCP Á Châu',
  },
  {
    label: 'MB - Ngân hàng TMCP Quân đội',
    value: 'MB - Ngân hàng TMCP Quân đội',
  },
  {
    label: 'Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam',
    value: 'Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam',
  },
  {
    label: 'Vietcombank - Ngân hàng Ngoại thương Việt Nam',
    value: 'Vietcombank - Ngân hàng Ngoại thương Việt Nam',
  },
  {
    label: 'Dong A Bank - Ngân hàng TMCP Đông Á',
    value: 'Dong A Bank - Ngân hàng TMCP Đông Á',
  },
];

export const reconciliationStatusOptions: SelectProps['options'] = [
  {
    label: 'Đang đối soát',
    value: 'pending',
  },
  {
    label: 'Đã đối soát',
    value: 'completed',
  },
  {
    label: 'Đã huỷ',
    value: 'cancelled',
  },
];
