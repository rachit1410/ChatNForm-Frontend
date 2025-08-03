import { Settings, BookPlus, ClipboardPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAddGroup } from '../features/chat/chatSlice';


const Nav = function ({expandedSection, setExpandedSection }) {

    const dispatch = useDispatch();
    const addGroup = useSelector((state) => state.chat.addGroup);
    const user = useSelector((state) => state.auth.user);
    

    const handleAddGroup = () => {
        if (!addGroup){
            dispatch(toggleAddGroup());
        }
    };

    const toggleSection = (sectionIndex) => {
        if ( expandedSection !== sectionIndex ) {
            setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex);
        }
    };

    const section1Width = expandedSection === 0 ? 'w-15/2' : 'w-1/2';
    const section2Width = expandedSection === 1 ? 'w-15/2' : 'w-1/2';

    return (
        <div className="flex w-full p-0 m-0 items-center">
            <div
                className={`flex items-center justify-between p-2 bg-emerald-500 text-black transition-all ${section1Width} cursor-pointer rounded-r-full`}
                onClick={() => toggleSection(0)}
            >
                <span className="font-semibold text-xl">{ expandedSection ? "CNF" : "ChatNF"}</span>
                { !expandedSection &&
                    <div className="flex space-x-4 mr-2">
                        <BookPlus className="w-5 h-5 cursor-pointer" onClick={handleAddGroup} />
                        <Settings className="w-5 h-5 cursor-pointer" />
                    </div>
                }
            </div>
            <div className="flex justify-center items-center mx-2">
                <div className="border-4 border-black rounded-full bg-white flex items-center justify-center" style={{ width: 52, height: 52 }}>
                    <img src={`${import.meta.env.VITE_DJANGO_URL}${user.profile_image}` || `https://placehold.co/40x40/FF2343/FFFFFF?text=${user.name[0]}`} alt="" className="w-10 h-10 rounded-full" />
                </div>
            </div>
            <div
                className={`flex items-center justify-between p-2 bg-red-500 text-white transition-all ${section2Width} cursor-pointer rounded-l-full`}
                onClick={() => toggleSection(1)}
            >
                { expandedSection ?
                    <>
                        <span className="font-semibold text-xl">CNForm</span>
                        <div className="flex space-x-4">
                            <ClipboardPlus className="w-5 h-5 cursor-pointer"/>
                            <Settings className="w-5 h-5 cursor-pointer" />
                        </div>
                    </>:
                    <>
                        <span className="font-semibold text-xl">CNF</span>
                    </>
                }
            </div>
        </div>
    );
};

export default Nav;