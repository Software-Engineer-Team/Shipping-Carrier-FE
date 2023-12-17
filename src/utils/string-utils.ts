import unorm from 'unorm';

export class StringUtils {
  public static formatterCurrency(value: number | undefined): string {
    if (!value) return '0';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  public static getStatusReconciliationTitle(status: string | undefined): string {
    switch (status) {
      case 'pending':
        return 'Đang đối soát';
      case 'completed':
        return 'Đã đối soát';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Chưa biết trạng thái';
    }
  }
  public static getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'pending':
        return 'processing';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  }

  public static getStatusOrderColor(status: string | undefined): string {
    switch (status) {
      case 'Đang chờ lấy hàng':
        return '#108ee9';
      case 'Đang vận chuyển':
        return '#f50';
      case 'Giao hàng thành công':
        return '#87d068';
      case 'Đơn hàng hủy':
        return '#7e8182';
      case 'Vận chuyển thất bại':
        return '#cd201f';
      default:
        return 'processing';
    }
  }

  public static delimitList(strArr: string[], delimiter: string): { list: string; last: string } | void {
    if (!strArr || !Array.isArray(strArr)) {
      return;
    }
    return {
      last: strArr[strArr.length - 1],
      list: strArr.slice(0, strArr.length - 1).join(`${delimiter} `),
    };
  }

  public static humanize(str: string): string {
    // 1)  ^[\s_]+|[\s_]+$ catches 1 or more white-space characters or underscores
    // either at the very beginning (^) or at the very end ($) of the string.

    // 2)  [_\s]+ Again catches 1 or more white-space characters or underscores,
    // since the ones at the beginning/end of the string are gone, replace with 1 space

    // 3)  ^[a-z] Catch a lowercase letter at the beginning of the string.
    // Replace with the uppercase version of the match

    return str
      .replace(/^[\s_]+|[\s_]+$/g, '')
      .replace(/[_\s]+/g, ' ')
      .replace(/^[a-z]/, m => m.toUpperCase());
  }

  /**
   * Uppercase first char of each word.
   */
  public static properCase(str: string): string {
    if (!str) {
      return str;
    }
    return str.toLowerCase().replace(/\b[a-zA-Z]/g, char => char.toUpperCase());
  }

  /**
   * Uppercase first char of each sentence and lowercase other chars.
   */
  public static sentenceCase(str: string): string {
    if (!str) {
      return str;
    }
    return str.toLowerCase().replace(/(^\w)|\.\s+(\w)/gm, char => char.toUpperCase());
  }

  public static alphabetize(arr: string[]): string[] {
    return arr.sort((a: string, b: string) => {
      const nameA = a.toLowerCase();
      const nameB = b.toLowerCase();

      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    });
  }

  public static capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * @example 1112223333 -> (111) 222-3333
   * @deprecated Does not handle international numbers. Use [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js).
   */
  public static formatPhoneNumber(phoneNumber: string, includeIntlCode = false) {
    const cleanNumber = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleanNumber.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] && includeIntlCode ? '+1' : '';
      return `${intlCode} (${match[2]}) ${match[3]}-${match[4]}`.trim();
    }
    return phoneNumber;
  }

  /**
   * @example outdoor_camera -> outdoorCamera
   */
  static convertSnakeToCamelCase(str: string) {
    return str
      .split('_')
      .map((word, i) => (i > 0 ? this.capitalizeFirstLetter(word) : word))
      .join('');
  }

  public static padString = (str: number, pad: number): string => {
    let newStr = str?.toString?.() || '';
    for (let i = newStr.length; i < pad; i += 1) {
      newStr = `0${str}`;
    }
    return newStr;
  };

  public static convertTimePlayer = (remSeconds: number): string => {
    const minutes = Math.floor(remSeconds / 60);
    const seconds = Math.round(remSeconds % 60);
    return `${this.padString(minutes, 2)}:${this.padString(seconds, 2)}`;
  };

  public static convertDispenseQuantityToString = (quantity: number) => {
    const units = Math.floor(quantity / 4);
    const quarterUnits = quantity / 4 - units;
    let fractionString = '';

    switch (quarterUnits) {
      case 0.25:
        fractionString = '1/4';
        break;
      case 0.5:
        fractionString = '1/2';
        break;
      case 0.75:
        fractionString = '3/4';
        break;
      default:
        break;
    }

    return `${units || ''} ${fractionString}`;
  };

  /**
   * Converts a string fraction expression into quarters numerical representation
   * @example 2 1/2 -> 10
   * @example 2 -> 8
   * @example 3/4 -> 3
   */
  public static convertStringFractionToQuartersInt = (value: string) => {
    const hasBlankSpaces = value.includes(' ');
    if (hasBlankSpaces) {
      const values = value.split(' ');

      // eslint-disable-next-line no-eval
      return (Number(values[0]) + eval(values[1])) * 4;
    }

    // eslint-disable-next-line no-eval
    return eval(value) * 4;
  };

  public static convertNumberToToken = (value: number) => {
    if (!value) return '0 token';
    return value.toLocaleString() + ' tokens';
  };

  public static convertNumberToCurrency = (value: number) => {
    if (!value) return '0';
    return value.toLocaleString('vi', {
      currency: 'VND',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: 'currency',
    });
  };

  public static removeAccents = (inputString: string) => {
    return unorm.nfd(inputString).replace(/[\u0300-\u036f]/g, '');
  };

  public static hiddenPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3');
  };

  public static uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}
