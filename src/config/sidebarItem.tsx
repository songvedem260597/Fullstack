import { MdSpaceDashboard } from "react-icons/md";
import { GrHostMaintenance } from "react-icons/gr";
import { BsFiletypeMp3 } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";


export const sidebarItem = [
    {
        label:'Dashboard',
        icon: <MdSpaceDashboard />,
        items:[
            {
                icon: <FaChartArea />,
                active:['dashboard'],
                label:'Thống kê',
                links:[
                    {title:'Thống kê chung', to:'/dashboard'},
                    {title:'Thống kê bài hát', to:'/dashboard/songs'},
                    {title:'Thống kê nhạc sĩ', to:'/dashboard/artist'},
                    {title:'Thống kê user', to:'/dashboard/user'},

                ]
            }
        ]
    },
    {
        label:'Function',
        icon: <GrHostMaintenance />,
        items:[
            {
                icon: <BsFiletypeMp3 />,
                active:['music'],
                label:'Music',
                links:[
                    {title:'Thống kê bài hát', to:'/music'},
                    {title:'Thống kê nhạc sĩ', to:'/music/artist'},
                    {title:'Thống kê playlist', to:'/music/playlist'},
                ]
            }
        ]
    },
];