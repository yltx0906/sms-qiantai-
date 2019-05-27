import React from 'react'
import { Button, Table,Modal, Form, Input, Radio,Calendar,Collapse } from 'antd'
import $ from 'jquery'
import moment from 'moment'

class StudentCourse extends React.Component {
  constructor(){
    super();
    this.state = {
      courses:[],
      students:[],
      studentcourses:[],
      visible:false,
      form:{
         choosetime:'',
         studentId:'',
         courseId:''
      }
    }
  }
  componentDidMount(){
    // 1. 加载下拉框中课程信息
     this.loadCourses();
     //2.加载下拉框中学生信息
     this.loadStudents();
     //3.加载选课信息
     this.loadStudentCourses();
     //4.加载选课中学生信息
     this.loadSCandStudent();
     //5.加载选课中课程信息
     this.loadSCandCourse();
  }
  
    
  //加载下拉框中课程信息
  loadCourses(){
    $.get("http://localhost:8888/course/findAll",({status,message,data})=>{
      if(status === 200){
        // 将查询数据设置到state中
        this.setState({
            "courses":data,
            form:{...this.state.form,...{courseId:data[0].id}}
        })
      } else {alert (message)}
    })
  }
  //加载下拉框中学生信息
  loadStudents = ()=>{
    let url = 'http://localhost:8888/student/findAll';
    $.get(url, ({status,message,data}) =>{
      if(status === 200){
        //将data中数据更新状态中
        this.setState({
            "students":data,
            form:{...this.state.form,...{studentId:data[0].id}}
        });
      } else {
        alert(message);
      }
    });
  }
  //加载选课信息
  loadStudentCourses(){
    $.get("http://localhost:8888/sc/findAll",({status,message,data})=>{
      if(status === 200){
        // 将查询数据设置到state中
        this.setState({ "studentcourses":data })
      } else {alert (message)}
    })
  }

  //加载选课中学生信息
loadSCandStudent(){
  $.get("http://localhost:8888/sc/findAllWithStudent",({status,message,data})=>{
    if(status === 200){
      // 将查询数据设置到state中
      this.setState({ "studentcourses":data })
    } else {alert (message)}
  })
}
  //加载选课中课程信息
loadSCandCourse(){
  $.get("http://localhost:8888/sc/findAllWithCourse",({status,message,data})=>{
    if(status === 200){
      // 将查询数据设置到state中
      this.setState({ "studentcourses":data })
    } else {alert (message)}
  })
}
  //添加或更新
  submitHandler = (event)=>{
    let url = "http://localhost:8888/sc/saveOrUpdate"
    $.post(url,this.state.form,({message})=>{
        alert(message);
        this.setState({
          visible:false
        })
        //点击确定刷新页面
        this.loadStudentCourses();
    })
    event.preventDefault();
  }

  //点击删除
  delStudentCourse(id){
    let url = 'http://localhost:8888/sc/deleteById?id='+id;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadStudentCourses();
      }
      alert(message);
    })
  }

  // //批量删除
  // batchdelStudentCourses(ids){
  //   let ids1 = JSON.stringify(ids);
  //   let url = 'http://localhost:8888/sc/deleteById?id='+ids;
  //   $.get(url,({status,message,data})=>{
  //     if(status === 200){
  //       this.loadStudentCourses();
  //       this.setState({ "ids1":data })
  //     }
  //     alert(message);
  //   })
  // }
  
  //点击弹出信息框
  showModal = (event) => {
    this.setState({
      visible: true,
      form:{     
         choosetime:'',
         studentId:'',
         courseId:''
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
    $.get("http://localhost:8888/sc/findById?id="+id,({status,message,data})=>{
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
         choosetime:'',
         studentId:'',
         courseId:''
        
      }
    })
  }

  render() {
    let { courses,students,form} = this.state;
    let now = moment(this.state.form.choosetime).format("YYYY-MM-DD HH:mm:ss");
    // alert(this.state.form.choosetime);
    
    let columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key:'id'
      },
      {
        title: '选课时间',
        dataIndex: now,
        key:'choosetime'
      },
      {
        title: '选课学生',
        dataIndex: 'student.realname',
        // key:'studentId' 
      },
      {
        title: '选择课程',
        dataIndex: 'course.name',
        // key:'courseId'
      },
      {
        title: '操作',
        
        render: (item) => (
          <span>
           
            <Button type="primary" onClick={this.toUpdate.bind(this,item.id)}>更新</Button>
            <span> </span>
            <Button type="danger" onClick={this.delStudentCourse.bind(this,item.id)}>删除</Button>
          </span>
        )
      }
    ]

    return (
      <div>
        <h2>选课管理</h2>
        <div>
        <Button type="primary" onClick={this.showModal}>新学一门课程</Button>
        <Button type="danger">批量删除</Button>
        {/* <Button type="link">保存</Button> */}
        </div>
        {/* 通过table绑定数据 */}
        <Table bordered={Collapse} rowKey = { record => record.id }
        dataSource= {this.state.studentcourses} 
        columns= {columns} />;
        
        {/* 日历 */}
        {/* <Calendar /> */}
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
         
          选课学生 :<br/>
          <select name="studentId" value={form.studentId} onChange={this.changeHandler}>
            {
                students.map((item)=>{
                return <option value={item.id} key={item.id} >{item.realname}</option>
              })
            }
          </select><br/>
          选择课程 :<br/>
          <select name="courseId" value={form.courseId} onChange={this.changeHandler}>
            {
                courses.map((item)=>{
                return <option value={item.id} key={item.id} >{item.name}</option>
              })
            }
          </select><br/>

        </Form>
        
      </Modal>
      </div>
    );
  }
}


export default StudentCourse;