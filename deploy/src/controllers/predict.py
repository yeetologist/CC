import pickle
import sys

def load_model(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model

def get_prediction(model, sex, age, height, weight):
    pred_index = int(model.predict([[sex, age, height, weight]])[0])

    category_mapping = {
        0: 'Stunting',
        1: 'Overweight',
        2: 'Gizi Baik',
        3: 'Underweight'
    }

    pred_label = category_mapping.get(pred_index, 'Unknown')
    return pred_label

if __name__ == '__main__':
    model_path = "model.pkl"
    model = load_model(model_path)

    # Get input values from command line arguments
    sex, age, height, weight = map(float, sys.argv[1:])

    # Get and print the prediction
    prediction = get_prediction(model, sex, age, height, weight)
    print(prediction)
