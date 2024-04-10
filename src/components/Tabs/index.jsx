import CustomIcon from "../CustomIcon"

import "./index.scss"

const Tabs = ({ tabs, currentTab, onChangeTab }) => {
  return (
    <div className="tabs">
      {tabs.map((tab, index) => {
        return (
          <button
            key={index}
            className={`tabs__tab-item ${
              currentTab.tabName === tab.tabName && "tabs__tab-item--selected"
            }`}
            onClick={() => onChangeTab(tab)}
          >
            <span>{tab.tabName}</span>
            <CustomIcon icon={tab.icon} size={18} />
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
