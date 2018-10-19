export const FormField = (roleData,chiefType,isChief,{ChiefLevel, ChiefType}) => {
  const chiefArray = filterField(chiefType);
  let normalField =
    [{
      label: '登陆账号',
      type: 'input',
      name: 'loginName',
      edit: false,
      requireShow: true,
      options: {
        rules: [{
          required: true,
          message: '请输入登陆账号!',
        },]
      }
    }, {
      label: '登录密码',
      type: 'input',
      notLook: true,
      downType: 'password',
      name: 'passwd',
      requireShow: true,
      edit: false,
      notEdit: true,
      options: {
        rules: [{
          min:6,
          max:20,
          required: true,
          message: '密码请输入为6到20位!',
        },]
      }
    }, {
      label: '用户名',
      type: 'input',
      edit: true,
      requireShow: true,

      name: 'nickname',
      options: {
        rules: [{
          required: true,
          message: '用户名必须有!',
        },]
      }
    }, {
      label: '用户角色',
      type: 'select',
      name: 'roleIds',
      requireShow: true,
      lookName: 'roles',
      edit: true,
      editDataType: 'Array',
      lookField: 'name',
      multiple: 'multiple',
      items: () => roleData.map(ele => ({
        value: ele.id,
        name: ele.name
      })),
      options: {
        rules: [{
          required: true,
          message: '请选择用户角色!',
        },]
      }
    }, {
      label: '行政区',
      type: 'cascaderRegion',
      name: 'areaId',
      edit: true,
      lookName: 'areaName',
      editName: 'areaId',
      requireShow: true,
      options: {
        rules: [{
          required: true,
          message: '请选择行政区!',
        },]
      }
    },
      {
        label: '组织机构和职务',
        type: 'ChiefSelect',
        name: 'orgPosts',
        edit: true,
        attr: ['orgId', 'post'],
        requireShow: true,
        options: {
          rules: [{
            required: true,
            message: '请选择填写组织机构和行政职务!',
          },]
        }
      },
      {
        label: '手机号码',
        type: 'inputNumber',
        name: 'mobile',
        edit: true,
        requireShow: true,
        options: {
          rules: [{
            required: false,
          },]
        }
      }, {
      label: '用户头像',
      type: 'upload',
      lookImg: true,
      requireShow: true,
      lookName: 'avatarUrl',
      name: 'avatarUrl',
    }, {
      label: '用户邮箱',
      type: 'input',
      name: 'email',
      edit: true,
    }, {
      label: '联系电话',
      type: 'input',
      name: 'phone',
      edit: true,
    }
    // ,{
    //   label: '是否河长',
    //   type: 'switch',
    //   name: 'ifChief',
    //   edit: true,
    //   requireShow: true,
    //   options: {
    //     initialValue: false,
    //     rules: [{
    //       required: false,
    //       message: '请选择是否河长!',
    //     },]
    //   }
    // }
    ,{
      label: '备注',
      type: 'textarea',
      name: 'description',
      edit: true,
    }];
  if(isChief){
    normalField=normalField.concat(aboutChief(ChiefLevel, ChiefType),chiefArray);
  }
  return normalField;
};

const aboutChief = (ChiefLevel, ChiefType) => [ {
  label: '是否总河长',
  type: 'switch',
  name: 'chiefHead',
  edit: true,
  requireShow: true,
  options: {
    initialValue: false,
    rules: [{
      required: true,
      message: '请选择是否总河长!',
    },]
  }
}, {
  label: '河长类别',
  type: 'select',
  name: 'chiefType',
  edit: true,
  requireShow: true,
  items: ChiefType,
  options: {
    rules: [{
      required: true,
      message: '请选择河长类别!',
    },]
  }
}];
const filterField = (chiefType) => {
  const chiefArray = [];
  chiefType.map(ele => {
    switch (ele) {
      case "RIVER":
        chiefArray.push({
          label: '管辖河段',
          type: 'RiverReachChoose',
          name: 'jurisdictionalRiverReachIds',
          edit: true,
          requireShow: true,
          options: {
            rules: [{
              required: true,
              message: '请选择管辖河段!',
            },]
          }
        });
        break;
      case "LAKE":
        chiefArray.push({
          label: '管辖湖泊',
          type: 'LakesChoose',
          name: 'jurisdictionalLakeIds',
          edit: true,
          requireShow: true,
          options: {
            rules: [{
              required: true,
              message: '请选择管辖湖泊!',
            },]
          }
        });
        break;
      case"RESERVOIR":
        chiefArray.push({
          label: '管辖水库',
          type: 'ReservoirChoose',
          name: 'jurisdictionalReservoirIds',
          edit: true,
          requireShow: true,
          options: {
            rules: [{
              required: true,
              message: '请选择管辖水库!',
            },]
          }
        });
        break;
      default:
        return;
    }
  });
  return chiefArray;
};
