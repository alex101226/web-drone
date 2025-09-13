import {Fragment} from 'react';
import {Box, Typography, styled, IconButton} from '@mui/material';
import { Upload, Clear } from '@mui/icons-material';
import { message, srcset } from '@/utils'
import { uploadFile } from '@/services'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const CustomCardUpload = (props) => {
  const { onChangeUpload, preview } = props

  //  上传执行
  const onUpload = (params) => {
    uploadFile(params).then(res => {
      if (res.code === 0) {
        message.success('上传成功')
        onChangeUpload(res.data.url)
        // setPreview(globalThis.CONSTANTS.BASE_URL + res.data.url)
      } else {
        message.error('上传失败')
      }
    }).catch(() => {
      message.error('上传失败')
    })
  }

  //  上传
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = ''; // 清空选择
      return;
    }

    // 成功的回调：生成预览 + 模拟上传
    const reader = new FileReader();
    reader.onload = (e) => {
      // TODO: 这里可以调用后端接口上传
      if (e.target.result) {
        let formData = new FormData();
        formData.append('file', file);
        onUpload(formData)
      }
    };
    reader.readAsDataURL(file);
  }

  //  删除
  const handleClear = () => {
    if (preview) {
      onChangeUpload('')
    }
  }

  // 上传前的验证
  const validateFile = (file) => {
    const maxSizeMB = 2; // 限制大小 2MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      message.warning('只允许上传 JPG/PNG/GIF 格式图片')
      return false;
    }
    if (file.size / 1024 / 1024 > maxSizeMB) {
      message.warning(`图片大小不能超过 ${maxSizeMB} MB`)
      return false;
    }
    return true;
  };

  const renderUploadButton = () => {
    return (
        <Box component="label" sx={{
          width: 'calc(100vw / 5)',
          height: '150px',
          background: 'var(--custom-body-background)',
          borderRadius: 2,
          border: '1px solid var(--custom-body-background)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}>
          <Upload />
          <Box sx={{ml: 1}} />
          <Typography>上传照片</Typography>
          <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleUpload}
          />
        </Box>
    )
  }
  return (
      <Fragment>
        {
          preview
              ? <Box
                  sx={{
                    pl: 2, pt: 2, pb: 2, pr: 2,
                    position: 'relative',
              }}>
                <Box
                    component="img"
                    alt=""
                    sx={{ borderRadius: 1 }}
                    { ...srcset(globalThis.CONSTANTS.BASE_URL + preview, 200, 1, 1) }
                />
            <Box sx={{
              position: 'absolute',
              right: '2px',
              top: '2px',
              cursor: 'pointer',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}>
              <IconButton aria-label="clear" size="small" onClick={handleClear}>
                <Clear sx={{ color: 'white' }} />
              </IconButton>
            </Box>

          </Box>
              : renderUploadButton()
        }
      </Fragment>
  )
}
export default CustomCardUpload