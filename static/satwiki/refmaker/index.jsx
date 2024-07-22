const { Box, Button, TextField, Typography } = MaterialUI;

function App() {
  const generate = function() {
    var text1 = document.getElementById('text1').value;
    if (text1 != '' && (!isNaN(text1))) {
      text1 = `:${text1}`;
    }
    var text2 = document.getElementById('text2').value;
    var text3 = document.getElementById('text3').value;
    if (text2 == '' || text3 == '') {
      alert('引用网址或网页标题未填写！');
    } else {
      document.getElementById('output').value = (text1 != '') ? `<ref name="${text1}">[${text2} ${text3}]</ref>` : `<ref>[${text2} ${text3}]</ref>`;
    }
  }

  const copy = function() {
    if (document.getElementById('output').value != '') {
      document.getElementById('output').select();
      document.execCommand('copy');
      alert('已复制到剪贴板！');
    } else {
      alert('还没有内容哦！');
    }
  }

  return (
    <div align="center">
      <Typography variant="h2">维基参考注释生成工具</Typography>
      <Typography variant="h7">V240722A</Typography>
      <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '30vw' }, }} noValidate autoComplete="off">
        <TextField id="text1" label="代号/编号" variant="outlined" />
        <TextField id="text2" label="引用网址" variant="outlined" />
        <TextField id="text3" label="网页标题" variant="outlined" />
      </Box>
      <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '20vw' }, }} noValidate autoComplete="off">
        <Button onClick={generate} variant="outlined">生成</Button>
        &nbsp;&nbsp;&nbsp;
        <Button onClick={copy} variant="outlined">复制</Button>
      </Box>
      <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '85vw' }, }} noValidate autoComplete="off">
        <TextField id="output" multiline rows={3} InputProps={{ readOnly: true }} />
      </Box>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
