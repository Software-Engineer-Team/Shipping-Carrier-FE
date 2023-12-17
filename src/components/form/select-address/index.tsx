import { HomeFilled } from '@ant-design/icons';
import { useSelect } from '@refinedev/antd';
import { useList, useTranslate } from '@refinedev/core';
import { Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { APIEndPoint, StringUtils } from 'utils';

import { IAddress, IDistrictCustom, IProvinceCustom, IWardCustom } from '../../../interfaces/types';

interface SelectAddressProps {
  nameProvince: string;
  nameDistrict: string;
  nameWard: string;
  nameAddress: string;
  nameProvinceCode: string;
  nameDistrictCode: string;
  nameWardCode: string;
  labelProvince: string;
  labelDistrict: string;
  labelWard: string;
  labelAddress: string;
}

export interface IAddressResponse {
  data: IAddress[];
}

export const SelectAddress = (props: SelectAddressProps) => {
  const { labelAddress, labelDistrict, labelProvince, labelWard, nameAddress, nameDistrict, nameDistrictCode, nameProvince, nameProvinceCode, nameWard, nameWardCode } = props;
  const form = Form.useFormInstance();
  const translate = useTranslate();
  const [province, setProvince] = useState<IProvinceCustom | undefined>();
  const [district, setDistrict] = useState<IDistrictCustom | undefined>();
  const [districtList, setDistrictList] = useState<IDistrictCustom[]>([]);
  const [wardList, setWardList] = useState<IWardCustom[]>([]);

  const {
    queryResult: provinceQueryResults,
    selectProps: { options },
  } = useSelect<IProvinceCustom>({
    optionLabel: 'name',
    optionValue: 'name',
    queryOptions: {
      enabled: true,
    },
    resource: APIEndPoint.PROVINCE,
  });

  const { data: districtListResult } = useList<IDistrictCustom>({
    filters: [
      {
        field: 'province.province_id',
        operator: 'eq',
        value: province?.province_id,
      },
    ],
    queryOptions: {
      enabled: province !== undefined,
    },
    resource: APIEndPoint.DISTRICT,
  });
  const { data: wardListResult } = useList<IWardCustom>({
    filters: [
      {
        field: 'district.district_id',
        operator: 'eq',
        value: district?.district_id,
      },
    ],
    queryOptions: {
      enabled: province !== undefined && district !== undefined,
    },
    resource: APIEndPoint.WARD,
  });

  useEffect(() => {
    setDistrictList(districtListResult?.data || []);
  }, [districtListResult]);

  useEffect(() => {
    setWardList(wardListResult?.data || []);
  }, [wardListResult]);

  const onChangeProvince = (ProvinceName: any) => {
    // set value for province
    const data = provinceQueryResults?.data?.data.find((item: IProvinceCustom) => item.name === ProvinceName);
    if (data) {
      setProvince(data);
      form.setFieldValue(nameProvinceCode, data.province_id.toString());
      // reset value for district and ward
      setDistrict(undefined);
      setDistrictList([]);
      setWardList([]);
      form.setFieldValue(nameDistrict, undefined);
      form.setFieldValue(nameDistrictCode, undefined);
      form.setFieldValue(nameWard, undefined);
      form.setFieldValue(nameWardCode, undefined);
    }
  };

  const onChangeDistrict = (DistrictName: string) => {
    // set value for district
    const data = districtList.find((item: IDistrictCustom) => item.name === DistrictName);
    if (data) {
      setDistrict(data);
      form.setFieldValue(nameDistrictCode, data.district_id.toString());
      // reset value for ward
      setWardList([]);
      form.setFieldValue(nameWard, undefined);
      form.setFieldValue(nameWardCode, undefined);
    }
  };

  const onChangeWard = (WardName: string) => {
    // set value for ward
    const data = wardList.find((item: IWardCustom) => item.name === WardName);
    if (data) {
      form.setFieldValue(nameWardCode, data.ward_id.toString());
    }
  };

  return (
    <>
      <Form.Item
        label={translate(labelProvince)}
        name={nameProvince}
        rules={[
          {
            message: translate('form.error.notSelect', 'Vui lòng chọn Tỉnh/Thành phố'),
            required: true,
          },
        ]}
      >
        <Select
          options={options}
          filterOption={(input, option) =>
            StringUtils.removeAccents(option?.label?.toString()?.toLowerCase() ?? '')
              .trim()
              .toLowerCase()
              .includes(StringUtils.removeAccents(input).toLowerCase().trim())
          }
          onClear={() => {
            setProvince(undefined);
            setDistrict(undefined);
            setDistrictList([]);
            setWardList([]);
            form.setFieldValue(nameProvinceCode, undefined);
            form.setFieldValue(nameDistrict, undefined);
            form.setFieldValue(nameDistrictCode, undefined);
            form.setFieldValue(nameWard, undefined);
            form.setFieldValue(nameWardCode, undefined);
          }}
          allowClear
          showSearch
          placeholder={translate(labelProvince)}
          onSelect={onChangeProvince}
        ></Select>
      </Form.Item>
      <Form.Item
        hidden
        name={nameProvinceCode}
        shouldUpdate={(prevValues: any, curValues: any) => {
          return prevValues[nameProvince] !== curValues[nameProvince];
        }}
      ></Form.Item>
      <Form.Item
        label={translate(labelDistrict)}
        name={nameDistrict}
        rules={[
          {
            message: translate('form.error.notSelect', 'Vui lòng chọn Quận/Huyện'),
            required: true,
          },
        ]}
      >
        <Select
          placeholder={translate(labelDistrict)}
          options={
            districtList &&
            districtList.map((item: IDistrictCustom) => ({
              label: item.name,
              value: item.name,
            }))
          }
          allowClear
          onClear={() => {
            setDistrict(undefined);
            setWardList([]);
            form.setFieldValue(nameDistrictCode, undefined);
            form.setFieldValue(nameWard, undefined);
            form.setFieldValue(nameWardCode, undefined);
          }}
          showSearch={true}
          filterOption={(input, option) =>
            StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
              .trim()
              .toLowerCase()
              .includes(StringUtils.removeAccents(input).toLowerCase().trim())
          }
          onChange={onChangeDistrict}
          disabled={province === undefined}
        />
      </Form.Item>
      <Form.Item
        hidden
        name={nameDistrictCode}
        shouldUpdate={(prevValues: any, curValues: any) => {
          return prevValues[nameDistrict] !== curValues[nameDistrict];
        }}
      ></Form.Item>
      <Form.Item
        label={translate(labelWard)}
        name={nameWard}
        rules={[
          {
            message: translate('form.error.notSelect', 'Vui lòng chọn Phường/Xã'),
            required: true,
          },
        ]}
      >
        <Select
          placeholder={translate(labelWard)}
          showSearch={true}
          filterOption={(input, option) =>
            StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
              .trim()
              .toLowerCase()
              .includes(StringUtils.removeAccents(input).toLowerCase().trim())
          }
          allowClear
          onClear={() => {
            setWardList([]);
            form.setFieldValue(nameWard, undefined);
            form.setFieldValue(nameWardCode, undefined);
          }}
          options={
            wardList &&
            wardList.map((item: IWardCustom) => ({
              label: item.name,
              value: item.name,
            }))
          }
          onChange={onChangeWard}
          disabled={province === undefined || district === undefined}
        />
      </Form.Item>
      <Form.Item
        hidden
        name={nameWardCode}
        shouldUpdate={(prevValues: any, curValues: any) => {
          return prevValues[nameWard] !== curValues[nameWard];
        }}
      ></Form.Item>
      <Form.Item
        label={translate(labelAddress)}
        name={nameAddress}
        rules={[
          {
            message: translate('form.error.notSelect', 'Vui lòng nhập địa chỉ'),
            required: true,
          },
        ]}
      >
        <Input prefix={<HomeFilled />} placeholder={translate(labelAddress)} allowClear />
      </Form.Item>
    </>
  );
};
