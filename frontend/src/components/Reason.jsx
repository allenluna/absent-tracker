export const InputReason = (domain) => {

    const listReasons = {
        "VXIPHP" : [
            "Illness",
            "Bereavement",
            "Weather",
            "Transportation",
            "Accident/Injury",
            "Natural disaster",
            "Personal reasons",
            "Child Care",
            "Family hospitalized"
        ],
        "MCM" : [
            "Illness",
            "Bereavement",
            "FMLA",
            "ADA", 
            "Jury Duty", 
            "Weather",
            "Internet Outage",
            "Power outage",
            "Transportation",
            "Personal reasons",
            "Legal Hearing",
            "Political situation",
            "Emergency",
            "Early Leave",
            "Late Arrival",
            "Technical Issue",
            "Family Emergency"
        ],
        "VXIINDIA" : [
            "Illness",
            "Bereavement",
            "Weather",
            "Transportation",
            "Accident", 
            "Personal reasons",
            "Family medical emergency",
            "Traffic issues"
        ]
    }

    return listReasons[domain] || [];
}
