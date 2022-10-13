import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Upload } from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";

export default function BensForm({ visibility, close, asset }:  { visibility: any, close: any, asset: any }){

    const formikRef = useRef(null);

    const [comprovante, setComprovante] = useState(null);
    const [file, setFile] = useState(null);
    const [fileArrayBuffer,setfileArrayBuffer] = useState(null);

    const validationSchema = Yup.object().shape({
        name: Yup.string().label('name').required("Nome não pode estar vazio").nullable(),
        description: Yup.string().label('description').required("Descrição não pode estar vazio").nullable(),
        sku: Yup.string().label('sku').required("Código não pode estar vazio").nullable(),
        location: Yup.string().label('location').required("Local não pode estar vazio").nullable(),
        receipt: Yup.string().label('receipt').required("Nota Fiscal ou Comprovante não pode estar vazio").nullable()
    });

    const handleFileUpload = (file: RcFile,fileList: RcFile[]) => {
        if(!'application/pdf,image/jpeg,image/jpg,image/png'.split(',').includes(file.type)){
            message.error('Apenas os arquivos com extensão pdf,jpeg,jpg ou png são aceitos!');
            (file as any).status = "error";
        }else if(file.size / 1024 / 1024 > 2){
            message.error('Tamanho máximo do arquivo não pode exceder 2MB');
            (file as any).status = "error";
        }         
        
        return (file as any).status != 'error';
    }

    const handleFileChange = ({ file, fileList}) => {
        if(file.status === 'uploading'){
            const reader = new FileReader();
            reader.addEventListener('load',() => {
                setComprovante(reader.result);
                file.status = "done";
            });
            //reader.readAsArrayBuffer(file.originFileObj as RcFile);
            reader.readAsDataURL(file.originFileObj as RcFile);
            formikRef.current.setFieldValue('receipt',comprovante);            
            setFile(file);
            console.log(file);
        }else if(file.status === 'removed'){
            setComprovante(null); 
            setFile(null);          
            formikRef.current.setFieldValue('receipt',null);
        }
        return true;
    }

    let defaultFileList = [];
    if(asset?.id && asset.receipt){
        defaultFileList = [
            {
                uid: asset.receipt?.id,
                status: 'done',
                name: asset.receipt.name,
                url: asset.receipt.url
            }
        ]
    }

    const closeModal = (asset?: any) => {
        formikRef.current.resetForm({
            values: {
                sku: null,
                description: null,
                location: null,
                name: null,
                receipt: null
            },
        }); 
        close(asset);
    }    
    return (
        <div>
            <Modal
                visible={visibility}
                title={`${asset?.id ? 'Atualizar' : 'Cadastrar'} Bem`}
                onCancel={() => closeModal()}
                okText={asset?.id ? "Atualizar" : "Cadastrar"}
                onOk={async (e) => {
                    await formikRef.current.handleSubmit();
                }}
                destroyOnClose={true}
            >

                    <Formik
                      innerRef={formikRef}
                      validateOnChange={false}
                      validationSchema={validationSchema}
                      initialValues={{
                        name: asset?.name,
                        description: asset?.description,
                        sku: asset?.sku,
                        location: asset?.location?.location,
                        receipt: asset?.receipt?.url                                               
                      }}
                      initialErrors={{
                        name: null,
                        description: null,
                        sku: null,
                        location: null,
                        receipt: null 
                      }}
                      onSubmit={async(values, { resetForm }) => {
                        // const body = new FormData();
                        // body.append("description",values.description);
                        // body.append("name",values.name);
                        // body.append("sku",values.sku);
                        // body.append("location",values.location);
                        // body.append("receipt",new Uint8Array(values.receipt));
                        // body.append("fileName",file.name);
                        // console.log(body) 

                        let assetOldFileName = null;
                        if(asset?.id){
                            assetOldFileName = asset.receipt.name;
                        }
                        const response = await fetch(`/api/assets/${asset?.id ? asset?.id : '' }`,{
                            method: asset?.id ? 'PUT' : 'POST',
                            headers: {
                                // 'Content-type': 'multipart/form-data;boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL'
                                'Content-type': 'application/json'
                            },
                            // body
                            body: JSON.stringify({...values, fileName: file?.name, oldFileName: assetOldFileName})
                        })
                        const id = asset?.id;
                        const responseData = await response.json();
                        if(response.ok){
                            message.success(`Bem ${values.name} foi ${id ? "atualizado": "cadastrado"} `,7)                                             
                            setComprovante(null); 
                            closeModal(responseData.data.asset);
                        }else{
                            message.error(responseData.erro ?? 'Ocorreu um erro ao cadastrar o bem',7);
                        }           
                      }}
                    >
                        {
                            ({errors,touched, values, handleChange }) => (
                                <Form id="signupForm" layout="vertical" preserve={false}>
                                    {
                                        asset?.id && (
                                            <>
                                                <Form.Item label={"Código Único (Validador)"}>
                                                    <b>{asset.receipt?.digest}</b>
                                                </Form.Item>
                                                <Form.Item label={"Código do Patrimônio"}>
                                                    <b>{asset.code}</b>
                                                </Form.Item>
                                            </>
                                        )
                                    }
                                    <Form.Item label={"Nome"} help={errors.name} validateStatus={errors.name && touched.name ? "error" : ""} >
                                        <Input name="name" type={"text"} value={values.name}  onChange={handleChange}  />
                                    </Form.Item>
                                    <Form.Item label={"Descrição"}  help={errors.description} validateStatus={errors.description && touched.description ? "error" : ""}>
                                        <Input name="description" type={"text"} value={values.description} onChange={handleChange}  />
                                    </Form.Item>
                                    <Form.Item label={"Código"}  help={errors.sku} validateStatus={errors.sku && touched.sku ? "error" : ""} >
                                        <Input name="sku" type={"text"} value={values.sku} onChange={handleChange}  />
                                    </Form.Item>
                                    <Form.Item label={"Localização"}  help={errors.location} validateStatus={errors.location && touched.location ? "error" : ""} >
                                        <Input name="location" type={"text"} value={values.location} onChange={handleChange}  />
                                    </Form.Item>
                                    <Form.Item label={"Comprovante"} help={errors.receipt} validateStatus={errors.receipt && touched.receipt ? "error" : ""} >
                                        <Upload customRequest={({ file, onSuccess }) => {
                                            setTimeout(() => onSuccess("ok"),0)
                                        }}  defaultFileList={defaultFileList} name="receipt" accept="application/pdf,image/jpeg,image/jpg,image/png" multiple={false} maxCount={1} beforeUpload={handleFileUpload} onChange={handleFileChange} >
                                            <Button icon={<UploadOutlined />}>Carregar arquivo (pdf,jpeg,png)</Button>
                                        </Upload>
                                    </Form.Item>
                                </Form>
                            )
                        }
                    </Formik>
                    <style global jsx>
                        {
                            `
                            .form-footer button{
                                margin-right: 8px;
                            }
                            `
                        }
                    </style>
                
            </Modal>
        </div>
    )
}