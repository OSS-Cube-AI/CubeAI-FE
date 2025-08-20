import PaletteItem from "./PaletteItem";
import Green from '@/assets/block/green.svg';
import Yellow from '@/assets/block/yellow.svg';
import Purple from '@/assets/block/purple.svg';
import Pink from '@/assets/block/pink.svg';

const NODE_DEFS: {
  label: string;
  type: string;
  color: string;
  isToggle: boolean;
  parameters: number[];
}[] = [
  { "label": "dataset", "type": "pre", "color": Green, "isToggle": false, "parameters": [] },
  { "label": "is_test", "type": "pre", "color": Green, "isToggle": true, "parameters": [] },
  { "label": "test_dataset", "type": "pre", "color": Green, "isToggle": false, "parameters": [] },
  { "label": "test_ratio", "type": "pre", "color": Green, "isToggle": false, "parameters": [80] },
  { "label": "drop_na", "type": "pre", "color": Green, "isToggle": true, "parameters": [] }, 
  { "label": "drop_bad", "type": "pre", "color": Green, "isToggle": true, "parameters": [] },
  { "label": "min_label", "type": "pre", "color": Green, "isToggle": false, "parameters": [0] },
  { "label": "max_label", "type": "pre", "color": Green, "isToggle": false, "parameters": [9] },
  { "label": "split_xy", "type": "pre", "color": Green, "isToggle": true, "parameters": [] },
  { "label": "resize_n", "type": "pre", "color": Green, "isToggle": false, "parameters": [28] },
  { "label": "augment_method", "type": "pre", "color": Green, "isToggle": false, "parameters": [] },
  { "label": "augment_param", "type": "pre", "color": Green, "isToggle": false, "parameters": [] },
  { "label": "normalize", "type": "pre", "color": Green, "isToggle": false, "parameters": [] },

  { "label": "input_w", "type": "model", "color": Purple, "isToggle": false, "parameters": [28] },
  { "label": "input_h", "type": "model", "color": Purple, "isToggle": false, "parameters": [28] },
  { "label": "input_c", "type": "model", "color": Purple, "isToggle": false, "parameters": [1] },
  { "label": "conv1_filters", "type": "model", "color": Purple, "isToggle": false, "parameters": [32] },
  { "label": "conv1_kernel", "type": "model", "color": Purple, "isToggle": false, "parameters": [3] },
  { "label": "conv1_padding", "type": "model", "color": Purple, "isToggle": false, "parameters": [] },
  { "label": "conv1_activation", "type": "model", "color": Purple, "isToggle": false, "parameters": [] },
  { "label": "pool1_type", "type": "model", "color": Purple, "isToggle": false, "parameters": [] },
  { "label": "pool1_size", "type": "model", "color": Purple, "isToggle": false, "parameters": [2] },
  { "label": "pool1_stride", "type": "model", "color": Purple, "isToggle": false, "parameters": [2] },
  { "label": "use_conv2", "type": "model", "color": Purple, "isToggle": true, "parameters": [] },
  { "label": "conv2_filters", "type": "model", "color": Purple, "isToggle": false, "parameters": [64] },
  { "label": "conv2_kernel", "type": "model", "color": Purple, "isToggle": false, "parameters": [3] },
  { "label": "conv2_activation", "type": "model", "color": Purple, "isToggle": false, "parameters": [] },
  { "label": "use_dropout", "type": "model", "color": Purple, "isToggle": true, "parameters": [] },
  { "label": "dropout_p", "type": "model", "color": Purple, "isToggle": false, "parameters": [0.25] },
  { "label": "dense_units", "type": "model", "color": Purple, "isToggle": false, "parameters": [128] },
  { "label": "dense_activation", "type": "model", "color": Purple, "isToggle": false, "parameters": [] },
  { "label": "num_classes", "type": "model", "color": Purple, "isToggle": false, "parameters": [10] },

  { "label": "loss_method", "type": "train", "color": Yellow, "isToggle": false, "parameters": [] },
  { "label": "optimizer_method", "type": "train", "color": Yellow, "isToggle": false, "parameters": [] },
  { "label": "learning_rate", "type": "train", "color": Yellow, "isToggle": false, "parameters": [0.00001] },
  { "label": "epochs", "type": "train", "color": Yellow, "isToggle": false, "parameters": [10] },
  { "label": "batch_size", "type": "train", "color": Yellow, "isToggle": false, "parameters": [64] },
  { "label": "patience", "type": "train", "color": Yellow, "isToggle": false, "parameters": [3] },

  { "label": "metrics", "type": "eval", "color": Pink, "isToggle": true, "parameters": [] },
  { "label": "average", "type": "eval", "color": Pink, "isToggle": false, "parameters": [] },
  { "label": "topk_k", "type": "eval", "color": Pink, "isToggle": false, "parameters": [3] },
  { "label": "show_classification_report", "type": "eval", "color": Pink, "isToggle": true, "parameters": [] },
  { "label": "show_confusion_matrix", "type": "eval", "color": Pink, "isToggle": true, "parameters": [] },
  { "label": "cm_normalize", "type": "eval", "color": Pink, "isToggle": true, "parameters": [] },
  { "label": "viz_samples", "type": "eval", "color": Pink, "isToggle": false, "parameters": [10] },
  { "label": "viz_mis", "type": "eval", "color": Pink, "isToggle": false, "parameters": [5] },
  { "label": "eval_batch", "type": "eval", "color": Pink, "isToggle": false, "parameters": [128] },
  { "label": "num_classes", "type": "eval", "color": Pink, "isToggle": false, "parameters": [10] },
  { "label": "class_names", "type": "eval", "color": Pink, "isToggle": false, "parameters": [] },
  { "label": "force_cpu", "type": "eval", "color": Pink, "isToggle": true, "parameters": [] }
];

export default function NodePalette() {
  return (
    <>
      {NODE_DEFS.map((n) => (
        <div key={n.type} className="relative grid w-[336px] h-28 place-items-center px-4 py-2">
          <img
            src={n.color}
            alt={n.label}
            className="absolute inset-0 w-full h-full object-contain -z-10 pointer-events-none"
          />
          <PaletteItem {...n} />
        </div>
      ))}
    </>
  );
}