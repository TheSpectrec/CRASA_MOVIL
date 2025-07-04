import { BarChart3, Target, Bell, User } from "lucide-react-native";

export const icons = {
    alertas: (props) => (<Bell size="24" {...props} />),
    ventas: (props) => (<BarChart3 size="24" {...props} style={{ transform: [{rotate: '-90deg'}]}} />),
    cuotas: (props) => (<Target size="24" {...props} />),
    perfil: (props) => (<User size="24" {...props} />),
}