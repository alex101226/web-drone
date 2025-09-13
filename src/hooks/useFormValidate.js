import { useState } from 'react'

export const useFormValidate = () => {
  //  验证
  const [errors, setErrors] = useState({});

  //  车辆模块验证
  const handleCarFormValidate = (field, value) => {
    let error = '';
    if (field === 'vehicle_alias') {
      if (!value) error = '昵称不能为空'
    }
    if (field === 'brand') {
      if (!value) error = '账户不能为空';
    }
    if (field === 'password') {
      if (!value) error = '密码不能为空';
      else if (value.length < 6) error = '密码至少 6 位';
    }

    if (field === 'department') {
      if (!value) error = '部门不能为空';
    }

    if (field === 'position') {
      if (!value) error = '职位不能为空';
    }
    if (field === 'location') {
      if (!value) error = '当前位置不能为空';
    }
    setErrors((prev) => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field] = error
      } else {
        delete newErrors[field]
      }
      return newErrors
    });
  }

  //  登录模块验证
  const handleLoginFormValidate = (field, value) => {
    let error = '';
    if (field === 'username') {
      if (!value) error = '用户名不能为空';
    }
    if (field === 'password') {
      if (!value) error = '密码不能为空';
      else if (value.length < 6) error = '密码至少 6 位';
    }
    setErrors((prev) => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field] = error
      } else {
        delete newErrors[field]
      }
      return newErrors
    });
  }

  //  添加，修改用户模块验证
  const handleSaveUserFormValidate = (field, value) => {
    let error = '';
    if (field === 'username') {
      if (!value) error = '用户名不能为空';
    }
    if (field === 'password') {
      if (!value) error = '密码不能为空';
      else if (value.length < 6) error = '密码至少 6 位';
    }
    if (field === 'nickname') {
      if (!value) error = '昵称不能为空'
    }
    if (field === 'department') {
      if (!value) error = '部门不能为空';
    }
    if (field === 'position') {
      if (!value) error = '职位不能为空';
    }
    if (field === 'location') {
      if (!value) error = '当前位置不能为空';
    }
    setErrors((prev) => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field] = error
      } else {
        delete newErrors[field]
      }
      return newErrors
    });
  }

  return {
    errors, setErrors, handleCarFormValidate,
    handleLoginFormValidate, handleSaveUserFormValidate,
  };
}