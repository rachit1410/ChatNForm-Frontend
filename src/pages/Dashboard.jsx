import { useState } from "react"
import ChatDB from "../components/ChatDB"
import FormDB from "../components/FormDB"
import Nav from "../components/Nav"

const Dashboard = function () {
    const [expandedSection, setExpandedSection] = useState(0)
    return(
        <div className="flex flex-col h-screen bg-gray-100 font-inter">
            <Nav 
            expandedSection = {expandedSection}
            setExpandedSection = {setExpandedSection}
            />
            { expandedSection === 0 ? <ChatDB/> : <FormDB/> }
        </div>
    )
} 

export default Dashboard