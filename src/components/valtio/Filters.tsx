import { useSnapshot } from "valtio";
import { todoState } from "./TodoState";
import { Button } from "../ui/button";

export function Filters() {
    const snap = useSnapshot(todoState);

    return (
        <div className="flex gap-2 mb-4">
            <Button
                variant={snap.filter === 'all' ? 'default' : 'outline'}
                onClick={() => todoState.filter = 'all'}
            >
                全部
            </Button>
            <Button
                variant={snap.filter === 'pending' ? 'default' : 'outline'}
                onClick={() => todoState.filter = 'pending'}
            >
                待处理
            </Button>
            <Button
                variant={snap.filter === 'completed' ? 'default' : 'outline'}
                onClick={() => todoState.filter = 'completed'}
            >
                已完成
            </Button>
        </div>
    );
}

export default Filters;