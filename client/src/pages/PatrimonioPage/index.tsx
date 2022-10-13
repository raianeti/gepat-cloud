import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import moment from "moment-timezone";
import { useEffect, useReducer, useState } from "react";
import WithSession from "../../src/hoc/WithSession"
import BensForm from "./BensForm";

function Patrimonio(props){

    const [asset, setAsset] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    
    const sort = (data: Array<any>) => data.sort((a,b) => a.id - b.id);
    const [state, stateDispatcher] = useReducer((state, action) => {
        switch(action.type){
            case 'SET_ASSETS': return {...state,assets: sort(action.assets)};
            case 'ADD_ASSET': return {...state,assets: sort([ ...state.assets.filter(value => value.id != action.asset.id),{ key: action.asset.id, ...action.asset } ])}
            case 'REMOVE_ASSET': return {...state, assets: [...state.assets.filter(value => value.id != action.asset.id)]}
            default: return state;
        }
    },{
        assets: []
    })

    useEffect(() => {
        fetch('/api/assets',{
            method: 'GET',
        }).then( async(res) => {
            const jsonData = await res.json();
            stateDispatcher({type: 'SET_ASSETS', assets: jsonData.data.assets})
        })
    },[]);

    const openCloseModal = (newAsset?: any) => {
        if(newAsset){
            //setAssets([...assets.filter((value, index) => value.id != newAsset.id),{key: newAsset.id, ...newAsset}]);
            stateDispatcher({type: 'ADD_ASSET', asset: newAsset})
        }
        if(modalVisible && (asset as any).id){
            setAsset({});
        }
        setModalVisible(!modalVisible);        
    }

    const deleteAsset = (record: any) => {
        fetch(`/api/assets/${record.id}`,{
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(async(res) => {
            const jsonData = await res.json();
            if(res.ok){
                stateDispatcher({type: 'REMOVE_ASSET', asset: jsonData.data.asset})
                message.success(`Bem removido`,7);
            }else{
                message.error(jsonData.erro ?? "Ocorreu um erro ao remover o bem",7);
            }            
        });
    }

    return (
        <>
            <div>
                <Button type="primary" onClick={() => openCloseModal()}>Adicionar Bem</Button>
            </div>
            <BensForm visibility={modalVisible} close={(_asset?: any) => openCloseModal(_asset)} asset={asset} />
            <Table style={{padding: '5px 0'}} bordered
                size="middle"
                title={() => (
                    <div style={{ textAlign: "center", fontWeight: "bolder" }}>
                        Bens Cadastrados
                    </div>
                )}
                dataSource={state.assets}
            >
                <Column title={"Nome"} dataIndex={"name"}  />
                <Column title={"Descrição"} dataIndex={"description"}  />
                <Column title={"Localização"} dataIndex={"location"} render={(value: any, record: any) => record.location?.location}  />
                <Column title={"Código Único"} dataIndex={"digest"} render={(value: any,record: any) => record?.receipt?.digest }  />
                <Column title={"Validações Positivas"} dataIndex={"positive"} render={(value: any, record: any) => record.validations?.filter(s => s.validation).length || 0} />
                <Column title={"Validações Negativas"} dataIndex={"positive"} render={(value: any, record: any) => record.validations?.filter(s => !s.validation).length || 0} />
                <Column title={"Nota Fiscal"} dataIndex={"receipt"} render={(value: any, record: any) => <Button type="link" style={{padding:'0px'}} onClick={() => window.open(record.receipt.url,'_blank')}>Baixar arquivo</Button>} />
                <Column title={"Criado por"} dataIndex={"insertedBy"} render={(value: any,record: any) => record.insertedBy.login}  />
                <Column title={"Criado em"} dataIndex={"createdAt"} render={(value: any,record: any) => moment(record.createdAt).format('DD/MM/YYYY')}  />
                <Column title={"Ações"} dataIndex={"acoes"} render={(value: any, record:any) => {
                    return (
                        <Space>
                            <Button shape="circle" icon={<EditOutlined />} type="primary" onClick={() => {
                                setAsset(record);
                                openCloseModal();
                            }} ></Button>
                            <Popconfirm placement="topLeft" title={"Você tem certeza que deseja remover este bem?"} okText={"Sim"} cancelText={"Não"} onConfirm={() => deleteAsset(record)}>
                                <Button shape="circle" icon={<DeleteOutlined />} type="primary" danger></Button>
                            </Popconfirm>
                        </Space>
                    )
                }} />
            </Table>
        </>
    )
}

export default WithSession(Bens);