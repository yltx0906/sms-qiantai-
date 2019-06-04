import React from 'react';
import $ from 'jquery';
import { Button, Table,Modal, Form, Input, Radio,Calendar,Collapse } from 'antd'

class Course extends React.Component {

  constructor(){
    super();
    this.state = {
      visible:false,
      teachers:[],
      courses:[],
      form:{
        name:"",
        credit:"",
        description:"",  
        teacherId:""
      }
    }
  }

  componentDidMount(){
    // 1. 加载下拉框中教师信息
    this.loadTeachers();
    // 2. 加载课程信息
    this.loadCourses();
    //3.加载课程中老师的信息
    this.loadCourseandTeacher();
  }

  //加载下拉框中教师信息
  loadTeachers(){
    $.get("http://localhost:8888/teacher/findAll",({status,message,data})=>{
      if(status === 200){
        // 将查询数据设置到state中
        this.setState({
          "teachers":data,
          form:{...this.state.form,...{teacherId:data[0].id}}
        })
      } else {alert (message)}
    })
  }

  //加载课程信息
  loadCourses(){
    $.get("http://localhost:8888/course/findAll",({status,message,data})=>{
      if(status === 200){
        // 将查询数据设置到state中
        this.setState({ "courses":data })
      } else {alert (message)}
    })
  }


//加载课程中老师信息
loadCourseandTeacher(){
  $.get("http://localhost:8888/course/findAllWithTeacher",({status,message,data})=>{
    if(status === 200){
      // 将查询数据设置到state中
      this.setState({ "courses":data })
    } else {alert (message)}
  })
}
   //添加或更新
   submitHandler = (event)=>{
    let url = "http://localhost:8888/course/saveOrUpdate"
    $.post(url,this.state.form,({message})=>{
      alert(message);
      this.setState({
        visible:false
      })
      //点击确定刷新页面
      this.loadCourses();
      this.loadCourseandTeacher();
    })
    event.preventDefault();
  }

   //点击删除
   delCourse(id){
    let url = 'http://localhost:8888/course/deleteById?id='+id;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadCourses();
      }
      alert(message);
    })
  }

  //点击弹出信息框
  showModal = (event) => {
    this.setState({
      visible: true,
      form:{     
        name:"",
        credit:"",
        description:"",
        teacherId:""
      }
    });
  };

  //把输入框中的内容绑定到表单上
  changeHandler = (event)=>{
    let name = event.target.name;
    let value = event.target.value;
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
    $.get("http://localhost:8888/course/findById?id="+id,({status,message,data})=>{
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
        name:"",
        credit:"",
        description:"",
        teacherId:""
      }
    })
  }


  render(){
    let {teachers,courses,form} = this.state;

    let columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key:'id'
      },
      {
        title: '课程名称',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '课程学分',
        dataIndex: 'credit',
        key:'credit' 
      },
      {
        title: '课程简介',
        dataIndex: 'description',
        key:'description'
      },
      {
        title: '任课老师',
        dataIndex: 'teacher.realname',
        // key:'realname'
      },
      {
        title: '操作',
        
        render: (item) => (
          <span>
           
            <Button type="primary" onClick={this.toUpdate.bind(this,item.id)}>更新</Button>
            <span> </span>
            <Button type="danger" onClick={this.delCourse.bind(this,item.id)}>删除</Button>
          </span>
        )
      }
    ]
    
    return (
      <div>
        <h2>课程管理</h2>
        <div>
        <Button type="primary" onClick={this.showModal}>添加新课程</Button>
        <Button type="danger">批量删除</Button>
        </div>
        {/* 通过table绑定数据 */}
        <Table bordered={Collapse} rowKey = { record => record.id }
        dataSource= {this.state.courses} 
        columns= {columns} />;
        
        <Modal
          title="添加一门课程"
          visible={this.state.visible}
          onOk={this.submitHandler}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
        {JSON.stringify(form)}
        
        
        <Form layout="vertical">
         
          课程名称 :
          <Input type="text" name="name" value={form.name} onChange={this.changeHandler}
            placeholder="请输入课程名称" /> <br/>
          课程学分 :
          <Input type="text" name="credit" value={form.credit} onChange={this.changeHandler}
            placeholder="请输入课程学分" /> <br/>
          课程简介 :
          <Input type="text" name="description" value={form.description} onChange={this.changeHandler}
            placeholder="请输入相关简介" /> <br/>
          任课老师 :<br/>
          <select name="teacherId" value={form.teacherId} onChange={this.changeHandler}
            placeholder="请选择">
              <option value="">--请选择--</option>
            {               
                teachers.map((item)=>{
                return <option value={item.id} key={item.id} >{item.realname}</option>
              })
            }
          </select><br/>
        </Form>
        
      </Modal>
      </div>
    );
  }
}

export default Course;