import { Document, Image, Page, StyleSheet, View, Text, PDFViewer, Font } from '@react-pdf/renderer';
import { Modal, ModalProps } from 'antd';
import React from 'react';

import { IOrder } from '../../interfaces/types';
import { StringUtils } from '../../utils';
// @ts-ignore
import RobotoRegular from './fonts/Roboto/Roboto-Bold.ttf';
Font.register({
  family: 'Roboto',
  fonts: [{ src: RobotoRegular }],
  fontStyle: 'normal',
  format: 'truetype',
});

interface AirwayBillProps {
  modalProps: ModalProps;
  ordersWithQr: { order: IOrder; qrcode: string; barcodeUrl: string }[];
}
export const AirwayBill: React.FC<AirwayBillProps> = props => {
  const { modalProps, ordersWithQr } = props;

  const renderContent = (title: string = '', name: string = '', phone_number: string = '', address: string = '', cod?: number) => {
    return (
      <View style={styles.boxInfo}>
        <View style={[styles.boxTitle, styles.flexRow, styles.flexSpaceBetween]}>
          <Text>{title}</Text>
          {cod && <Text> | COD: {StringUtils.convertNumberToCurrency(cod)}</Text>}
        </View>

        <View style={styles.flexRow}>
          <Text>Tên: </Text>
          <Text>{name}</Text>
        </View>
        {phone_number ? (
          <View style={styles.flexRow}>
            <Text>Số điện thoại: </Text>
            <Text>{phone_number}</Text>
          </View>
        ) : null}
        {address ? (
          <View style={[styles.flexRow, { flexWrap: 'wrap' }]}>
            <Text>Địa chỉ: </Text>
            <Text>{address}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const getCarrierImgPath = (order: IOrder) => {
    switch (order?.carrier?.name) {
      case 'GHTK':
        return '/images/assets/ghtk_icon.png';
      case 'GHN':
        return '/images/assets/ghn_icon.png';
      case 'NINJAVAN':
        return '/images/assets/ninjavan_icon.png';
      default:
        return '';
    }
  };

  const getTrackingId = (order: IOrder) => {
    if (order?.carrier?.name === 'GHTK') {
      return order?.tracking_id.match(/\d{10}$/)?.[0];
    }
    return order?.tracking_id;
  };
  return (
    <>
      <Modal {...modalProps} title={'In đơn hàng'} width="100%" footer={null}>
        <PDFViewer style={styles.viewer}>
          <Document pageMode={'useThumbs'} pdfVersion={'1.7'}>
            {ordersWithQr?.map((item, index) => {
              return (
                <Page size={'A5'} style={styles.page} orientation={'landscape'} key={index}>
                  <View style={[styles.flexRow, styles.flexSpaceBetween]}>
                    <View style={[styles.flexColumn, styles.flexCenter]}>
                      <View style={styles.qrcodeView}>
                        <Image source={getCarrierImgPath(item.order)} style={{ height: '90%', width: '90%' }} />
                      </View>
                      <Text>Giao bởi: {item.order.carrier.name}</Text>
                    </View>

                    <View style={[styles.flexColumn, styles.flexCenter]}>
                      <Text
                        style={{
                          textTransform: 'uppercase',
                        }}
                      >
                        BIG SIZE TMDV COMPANY LIMITED
                      </Text>
                      <Text>AIRWAY BILL</Text>
                      <Text>www.bigsizeship.vn</Text>

                      <View style={[styles.flexColumn, styles.flexCenter, styles.box]}>
                        <Text style={{ textTransform: 'uppercase' }}>For bigsizeship use</Text>
                      </View>
                      <Text>Mã đơn hàng: {getTrackingId(item.order)}</Text>
                      <Text>Cân nặng: {item.order?.weight} kg</Text>
                    </View>
                    <View style={styles.flexColumn}>
                      <View style={styles.barcodeView}>
                        <Image source={item.barcodeUrl} style={{ width: '100%' }} />
                      </View>
                    </View>
                    <View style={styles.flexColumn}>
                      <View style={[styles.flexColumn, styles.flexCenter]}>
                        <View style={styles.qrcodeView}>
                          <Image source={item.qrcode} />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.flexRow, styles.flexSpaceBetween]}>
                    <View style={[styles.flexColumn, styles.boxInfoContainer]}>
                      {renderContent(
                        'Bên gửi',
                        item.order?.from_name,
                        StringUtils.hiddenPhoneNumber(item.order?.from_phone_number),
                        ['***', item.order?.from_ward, item.order?.from_district, item.order?.from_province].join(', '),
                      )}
                    </View>
                    <View style={[styles.flexColumn, styles.boxInfoContainer]}>
                      {renderContent(
                        'Bên nhận',
                        item.order?.to_name,
                        StringUtils.hiddenPhoneNumber(item.order?.to_phone_number),
                        ['***', item.order?.to_ward, item.order?.to_district, item.order?.to_province].join(', '),
                        item.order?.cash_on_delivery,
                      )}
                    </View>
                  </View>
                  <View style={[styles.flexRow, styles.flexSpaceBetween, styles.box, styles.note]}>
                    <Text wrap={true}>Tên sản phẩm:</Text>
                    <Text wrap={true}>{item.order?.product_name}</Text>
                  </View>
                  <View style={[styles.flexRow, styles.flexSpaceBetween, styles.box, styles.note]}>
                    <Text wrap={true}>Chú thích:</Text>
                    <Text wrap={true}>{item.order?.delivery_instructions}</Text>
                  </View>
                </Page>
              );
            })}
          </Document>
        </PDFViewer>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  barcodeView: {
    alignItems: 'center',
    borderWidth: 1,
    display: 'flex',
    height: 80,
    justifyContent: 'center',
    width: 150,
  },
  box: {
    borderWidth: 1,
    marginVertical: 5,
    padding: 5,
  },
  boxInfo: {
    padding: 5,
  },
  boxInfoContainer: {
    borderWidth: 1,
    height: '100%',
    width: '100%',
  },
  boxTitle: {
    borderBottomWidth: 0.5,
    marginBottom: 5,
    paddingVertical: 5,
    textTransform: 'uppercase',
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexSpaceBetween: {
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: 'space-between',
  },
  note: {
    flexWrap: 'wrap',
    fontSize: 10,
  },
  page: {
    backgroundColor: '#fff',
    color: '#333',
    display: 'flex',
    fontFamily: 'Roboto',
    fontSize: 11,
    padding: '0.4in 0.4in',
  },
  qrcodeView: {
    alignItems: 'center',
    borderWidth: 1,
    display: 'flex',
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  viewer: {
    border: 'none',
    height: '80vh',
    paddingTop: 32,
    width: '100%',
  },
});
