import React from 'react'
import { Button, Table,Modal, Form, Input, Radio,Calendar, Collapse } from 'antd'
import $ from 'jquery'

class Teacher extends React.Component {
  constructor(){
    super();
    this.state = {
      teachers:[],
      visible:false,
      form:{
        username:'',
        // password:'',
        realname:'',
        gender:'',
      }
    }
  }
  componentDidMount(){
    // 1. 加载教师信息
     this.loadTeacher();
  }
  //加载老师信息
  loadTeacher = ()=>{
    let url = 'http://localhost:8888/teacher/findAll';
    $.get(url, ({status,message,data}) =>{
      if(status === 200){
        //将data中数据更新状态中
        this.setState({
          teachers:data
        });
      } else {
        alert(message);
      }
    });
  }
  //添加或更新
  submitHandler = (event)=>{
    let url = "http://localhost:8888/teacher/saveOrUpdate"
    $.post(url,this.state.form,({message})=>{
      alert(message);
      this.setState({
        visible:false
      })
      this.loadTeacher();
    })
    event.preventDefault();
  }
//点击删除
delTeacher(id){
  let url = 'http://localhost:8888/teacher/deleteById?id='+id;
  $.get(url,({status,message})=>{
    if(status === 200){
      this.loadTeacher();
    }
    alert(message);
  })
}
  //点击弹出信息框
  showModal = (event) => {
    this.setState({
      visible: true,
      form:{
        username:'',
        // password:'',
        realname:'',
        gender:''
      }
    });
  };
   
  //把输入框中的内容绑定到表单上
  changeHandler= (event)=>{
    let name = event.target.name;
    let value = event.target.value;
    // username/password/realname映射到state
    this.setState({
      form:{...this.state.form,...{[name]:value}}
    })
  }
    //关闭弹出框
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  
  //更新
  toUpdate(id){
    // 1. 通过id查找课程信息
    // 2. 将返回结果设置到this.state.form中
    // state->form
    $.get("http://localhost:8888/teacher/findById?id="+id,({status,message,data})=>{
      if(status === 200){
        // 将更新的数据设置到state中
        this.setState({ 
          visible: true,
          "form":data 
        })     
      } else {alert (message)}
    })
  }
  //添加
  toAdd=()=>{
    this.setState({
      flag:true,
      form:{
        username:'',
        realname:'',
        gender:''   
      }
    })
  }

  render() {
    let { form } = this.state;
    let columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key:'id'
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key:'username'
      },
      {
        title: '姓名',
        dataIndex: 'realname',
        key:'realname' 
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key:'gender'
      },
      {
        title: '操作',
        
        render: (item) => (
          <span>
            <Button type="primary" onClick={this.toUpdate.bind(this,item.id)}>更新</Button>
            <span> </span>
            <Button type="danger" onClick={this.delTeacher.bind(this,item.id)}>删除</Button>
          </span>
        )
      }
    ]

    return (
      <div>
        <h2>教师管理</h2>
        <div>
        <Button type="primary" onClick={this.showModal}>添加新教师</Button>
        <Button type="danger">批量删除</Button>
        {/* <Button type="link">保存</Button> */}
        </div>
        {/* 通过table绑定数据 */}
        <Table  bordered={Collapse} rowKey = { record => record.id }
        dataSource= {this.state.teachers} 
        columns= {columns} />
        
        {/* 日历 */}
        <Calendar />
        <Modal
          title="添加一个教师"
          visible={this.state.visible}
          onOk={this.submitHandler}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
        {JSON.stringify(form)}
        <Form layout="vertical">
          用户名 :
          <Input type="text" name="username" value={form.username} onChange={this.changeHandler}
             placeholder="请输入用户名" /> <br/>
          姓名 :
          <Input type="text" name="realname" value={form.realname} onChange={this.changeHandler}
            placeholder="请输入姓名"/> <br/>
          性别 :
          <Input type="text" name="gender" value={form.gender} onChange={this.changeHandler} 
            placeholder="请输入性别" /><br/>
          {/* <Radio value="男" name="gender" onChange={this.changeHandler}>男</Radio>
          <Radio value="女" name="gender" onChange={this.changeHandler}>女</Radio> */}
          
        </Form>
      </Modal>
      </div>
    );
  }
}


export default Teacher;