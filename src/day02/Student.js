import React from 'react';
import $ from 'jquery';

import { Button, Table,Modal, Form, Input, Collapse } from 'antd'

class Student  extends React.Component {
  constructor(){
    super();
    this.state = {
      students:[],
      form:{
        username:'',
        // password:'',
        realname:'',
        gender:'',
      }
    }
  }

  componentDidMount(){
    // 组件绑定后初始化学生数据
    this.loadStudent();
  }
  
  //加载学生信息
  loadStudent = ()=>{
    let url = 'http://localhost:8888/student/findAll';
    $.get(url, ({status,message,data}) =>{
      if(status === 200){
        //将data中数据更新状态中
        this.setState({
          students:data
        });
      } else {
        alert(message);
      }
    });
  }
  //添加或更新  
  submitHandler = (event)=>{
    let url = "http://localhost:8888/student/saveOrUpdate"
    $.post(url,this.state.form,({message})=>{
      alert(message);
      //刷新
      this.setState({
        visible:false
      })
      //点击确定刷新页面
      this.loadStudent();
    }) 
    event.preventDefault();
  }
  //点击删除
  delStudent(id){
    let url = 'http://localhost:8888/student/deleteById?id='+id;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadStudent();
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
    $.get("http://localhost:8888/student/findById?id="+id,({status,message,data})=>{
      if(status === 200){
        // 将更新的数据设置到state中    
        this.setState({ 
          visible: true,
          "form":data })
      } else {alert (message)}
    })
  }
  //添加
  toAdd=()=>{
    this.setState({
      flag:true,
      // students:{},
      form:{
        username:'',
        realname:'',
        gender:''
        
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
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
            <Button type="danger" onClick={this.delStudent.bind(this,item.id)}>删除</Button>
          </span>
        )
      }
    ]

    return (
      <div>
        <h2>学生管理</h2>
        <div>
        <Button type="primary" onClick={this.showModal}>添加新学生</Button>
        <Button type="danger">批量删除</Button>
        {/* <Button type="link">保存</Button> */}
        </div>
        {/* 通过table绑定数据 */}
        <Table  bordered={Collapse} rowKey = { record => record.id }
        dataSource= {this.state.students} 
        columns= {columns} />;
 
        <Modal
          title="添加一个学生"
          visible={this.state.visible}
          onOk={this.submitHandler}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
        
        {JSON.stringify(form)}
        <Form layout="Horizontal">
        <Form.Item label="用户名">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '用户名不能为空!' }],
          })(
          <Input type="text" name="username" value={form.username} onChange={this.changeHandler} 
          placeholder="请输入用户名" />
          )}</Form.Item>
         
          <Form.Item label="姓名">
          {getFieldDecorator('realname', {
            rules: [{ required: true, message: '姓名不能为空!' }],
          })(
          <Input type="text" name="realname" value={form.realname} onChange={this.changeHandler}
           placeholder="请输入姓名" />
           )}</Form.Item>
          <label>性别 ：
                  <select name="gender"  value={form.gender} onChange={this.changeHandler}>
                       <option value=""></option>
                       <option value="男">男</option>
                       <option value="女">女</option>
                       
                  </select>
          </label>

          {/* {getFieldDecorator('gender', {
            rules: [{ required: true, message: '性别不能为空!' }],
          })( */}
          {/* <Input type="text" name="gender" value={form.gender} onChange={this.changeHandler}
            placeholder="请输入性别" />
            )}</Form.Item> */}
          {/* 性别 :  
          <Input type="text" name="gender" value={form.gender} onChange={this.changeHandler}
           placeholder="请输入性别" /><br/>        */}
          
        </Form>
      </Modal>
      </div>
    );
  }
}

export default Form.create()(Student);


